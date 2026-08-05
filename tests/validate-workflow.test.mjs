import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { validateWorkflow, resolveRef, unwrapCatalog, ERROR } from '../scripts/validate-workflow.mjs'

/** Fixture'ı her seferinde taze okur, böylece testler birbirinin nesnesini bozmaz. */
const fx = (n) => JSON.parse(readFileSync(new URL(`./fixtures/${n}.json`, import.meta.url), 'utf8'))

const has = (r, code, node) =>
  r.errors.some((e) => e.code === code && (node === undefined || e.node === node))

// --- yapı ---

test('gecerli workflow dogrulamayi gecer', () => {
  const r = validateWorkflow(fx('workflow-valid'))
  assert.deepEqual(r.errors, [])
  assert.equal(r.valid, true)
})

test('nesne olmayan girdi reddedilir', () => {
  const r = validateWorkflow(null)
  assert.equal(r.valid, false)
  assert.equal(r.errors[0].code, ERROR.NOT_OBJECT)
})

test('contents yoksa hata verir', () => {
  const wf = fx('workflow-valid')
  delete wf.contents
  assert.ok(has(validateWorkflow(wf), ERROR.MISSING_CONTENTS))
})

test('contents.nodes yoksa hata verir', () => {
  const wf = fx('workflow-valid')
  delete wf.contents.nodes
  assert.ok(has(validateWorkflow(wf), ERROR.MISSING_NODES))
})

test('contents.schema.input yoksa hata verir', () => {
  const wf = fx('workflow-valid')
  delete wf.contents.schema
  assert.ok(has(validateWorkflow(wf), ERROR.MISSING_INPUT_SCHEMA))
})

test('display dugumu yoksa hata verir', () => {
  const wf = fx('workflow-valid')
  wf.contents.nodes.output.type = 'run'
  assert.ok(has(validateWorkflow(wf), ERROR.MISSING_OUTPUT_NODE))
})

test('dugumun id alani anahtarla uyusmazsa yakalanir', () => {
  const wf = fx('workflow-valid')
  wf.contents.nodes['node-hero'].id = 'baska-id'
  assert.ok(has(validateWorkflow(wf), ERROR.NODE_ID_MISMATCH, 'node-hero'))
})

test('olmayan dugume bagimlilik yakalanir', () => {
  const wf = fx('workflow-valid')
  wf.contents.nodes['node-hero'].depends = ['hayalet']
  assert.ok(has(validateWorkflow(wf), ERROR.UNKNOWN_DEPENDENCY, 'node-hero'))
})

test('input sanal dugumune bagimlilik gecerlidir', () => {
  const r = validateWorkflow(fx('workflow-valid'))
  assert.ok(!has(r, ERROR.UNKNOWN_DEPENDENCY))
})

// --- referanslar ---

test('cozulemeyen referans yakalanir', () => {
  assert.ok(has(validateWorkflow(fx('workflow-badref')), ERROR.UNRESOLVED_REFERENCE, 'node-a'))
})

test('schema.input icinde tanimsiz input alani yakalanir', () => {
  const wf = fx('workflow-valid')
  wf.contents.nodes['node-hero'].input.prompt = '$input.olmayan_alan'
  assert.ok(has(validateWorkflow(wf), ERROR.UNKNOWN_INPUT_FIELD, 'node-hero'))
})

test('depends listesinde olmayan dugume referans yakalanir', () => {
  const wf = fx('workflow-valid')
  wf.contents.nodes['node-hero'].input.extra = '$fal_ai/kling/v2_1.video'
  assert.ok(has(validateWorkflow(wf), ERROR.REFERENCE_NOT_DECLARED, 'node-hero'))
})

test('display dugumundeki fields referanslari da taranir', () => {
  const wf = fx('workflow-valid')
  wf.contents.nodes.output.fields.final_video = '$hayalet.video'
  assert.ok(has(validateWorkflow(wf), ERROR.UNRESOLVED_REFERENCE, 'output'))
})

test('ic ice ve dizi icindeki referanslar taranir', () => {
  const wf = fx('workflow-valid')
  wf.contents.nodes['node-hero'].input.nested = { list: ['$hayalet.x'] }
  assert.ok(has(validateWorkflow(wf), ERROR.UNRESOLVED_REFERENCE, 'node-hero'))
})

// --- resolveRef ---

test('resolveRef egik cizgili dugum id ile en uzun oneki secer', () => {
  const ids = ['fal_ai/kling', 'fal_ai/kling/v2_1']
  assert.equal(resolveRef('$fal_ai/kling/v2_1.video', ids), 'fal_ai/kling/v2_1')
})

test('resolveRef input sanal dugumunu cozer', () => {
  assert.equal(resolveRef('$input.film_name', ['input', 'node-a']), 'input')
})

test('resolveRef dolar isaretsiz degeri yok sayar', () => {
  assert.equal(resolveRef('duz metin', ['node-a']), null)
})

test('resolveRef bilinmeyen dugum icin null doner', () => {
  assert.equal(resolveRef('$hayalet.x', ['node-a']), null)
})

// --- döngü ---

test('dongu tespit edilir', () => {
  const r = validateWorkflow(fx('workflow-cycle'))
  assert.equal(r.valid, false)
  assert.ok(has(r, ERROR.CYCLE))
})

test('gecerli workflow donguye takilmaz', () => {
  assert.ok(!has(validateWorkflow(fx('workflow-valid')), ERROR.CYCLE))
})

test('kendine bagimlilik dongu sayilir', () => {
  const wf = fx('workflow-valid')
  wf.contents.nodes['node-hero'].depends.push('node-hero')
  assert.ok(has(validateWorkflow(wf), ERROR.CYCLE))
})

test('input sanal dugumu donguye sebep olmaz', () => {
  const wf = fx('workflow-valid')
  assert.ok(!has(validateWorkflow(wf), ERROR.CYCLE))
})

test('dongu mesaji zinciri gosterir', () => {
  const r = validateWorkflow(fx('workflow-cycle'))
  const cycle = r.errors.find((e) => e.code === ERROR.CYCLE)
  assert.match(cycle.message, /node-a/)
  assert.match(cycle.message, /node-b/)
})

// --- contents seviyesindeki zorunlu alanlar (fal'ın POST /workflows referansı) ---

test('contents.version yoksa yakalanir', () => {
  const wf = fx('workflow-valid')
  delete wf.contents.version
  assert.ok(has(validateWorkflow(wf), ERROR.MISSING_CONTENTS_VERSION))
})

test('contents.output yoksa yakalanir', () => {
  const wf = fx('workflow-valid')
  delete wf.contents.output
  assert.ok(has(validateWorkflow(wf), ERROR.MISSING_CONTENTS_OUTPUT))
})

test('contents.schema.output yoksa yakalanir', () => {
  const wf = fx('workflow-valid')
  delete wf.contents.schema.output
  assert.ok(has(validateWorkflow(wf), ERROR.MISSING_OUTPUT_SCHEMA))
})

test('bos schema.input gecerlidir', () => {
  const r = validateWorkflow(fx('workflow-valid'))
  assert.ok(!has(r, ERROR.MISSING_INPUT_SCHEMA))
  assert.equal(r.valid, true)
})

test('contents.output ile display.fields anahtarlari uyusmazsa yakalanir', () => {
  const wf = fx('workflow-valid')
  wf.contents.output = { baska_anahtar: '$fal_ai/kling/v2_1.video.url' }
  assert.ok(has(validateWorkflow(wf), ERROR.OUTPUT_MISMATCH))
})

test('contents.output referansi display.fields ile ayni olmali', () => {
  const wf = fx('workflow-valid')
  wf.contents.output.final_video = '$node-hero.images.0.url'
  assert.ok(has(validateWorkflow(wf), ERROR.OUTPUT_MISMATCH))
})

test('depends alani olmayan run dugumu yakalanir', () => {
  const wf = fx('workflow-valid')
  delete wf.contents.nodes['node-hero'].depends
  assert.ok(has(validateWorkflow(wf), ERROR.MISSING_DEPENDS, 'node-hero'))
})

// --- ffmpeg compose ozel denetimi ---

/** compose düğümü olan bir workflow üretir. */
function withCompose(tracks) {
  const wf = fx('workflow-valid')
  wf.contents.nodes['node-compose'] = {
    type: 'run',
    id: 'node-compose',
    app: 'fal-ai/ffmpeg-api/compose',
    depends: ['fal_ai/kling/v2_1'],
    input: { tracks },
  }
  return wf
}

test('compose keyframe alan adlari yanlissa yakalanir', () => {
  // clips/source/start_time uydurma alanlardir; gercegi keyframes/url/timestamp
  const wf = withCompose([
    { id: 'video', type: 'video', clips: [{ source: '$fal_ai/kling/v2_1.video.url', start_time: 0 }] },
  ])
  assert.ok(has(validateWorkflow(wf), ERROR.COMPOSE_BAD_TRACK, 'node-compose'))
})

test('compose keyframe icindeki bilinmeyen alan yakalanir', () => {
  const wf = withCompose([
    {
      id: 'video',
      type: 'video',
      keyframes: [
        { timestamp: 0, duration: 6000, url: '$fal_ai/kling/v2_1.video.url', transition_out: 'hard_cut' },
      ],
    },
  ])
  assert.ok(has(validateWorkflow(wf), ERROR.COMPOSE_BAD_TRACK, 'node-compose'))
})

test('saniye yazilmis gibi gorunen sure uyari verir', () => {
  // timestamp/duration MILISANIYE; 6 yazmak 6 ms demektir
  const wf = withCompose([
    { id: 'video', type: 'video', keyframes: [{ timestamp: 0, duration: 6, url: '$fal_ai/kling/v2_1.video.url' }] },
  ])
  assert.ok(has(validateWorkflow(wf), ERROR.COMPOSE_SUSPECT_MS, 'node-compose'))
})

test('dogru compose track sorun cikarmaz', () => {
  const wf = withCompose([
    {
      id: 'video',
      type: 'video',
      keyframes: [{ timestamp: 0, duration: 6000, url: '$fal_ai/kling/v2_1.video.url' }],
    },
  ])
  const r = validateWorkflow(wf)
  assert.ok(!has(r, ERROR.COMPOSE_BAD_TRACK))
  assert.ok(!has(r, ERROR.COMPOSE_SUSPECT_MS))
})

// --- katalog ---

test('katalogdaki app degerleri temiz gecer', () => {
  const r = validateWorkflow(fx('workflow-valid'), { catalog: fx('catalog') })
  assert.deepEqual(r.errors, [])
  assert.equal(r.valid, true)
})

test('katalogda olmayan app yakalanir', () => {
  const wf = fx('workflow-valid')
  wf.contents.nodes['node-hero'].app = 'fal-ai/olmayan-model'
  assert.ok(has(validateWorkflow(wf, { catalog: fx('catalog') }), ERROR.UNKNOWN_ENDPOINT, 'node-hero'))
})

test('katalog verilmezse app kontrolu atlanir', () => {
  const wf = fx('workflow-valid')
  wf.contents.nodes['node-hero'].app = 'fal-ai/olmayan-model'
  assert.ok(!has(validateWorkflow(wf), ERROR.UNKNOWN_ENDPOINT))
})

test('cache zarfli katalog da kabul edilir', () => {
  // lib/cache.mjs veriyi { fetchedAt, data } zarfına sarar; CLI bunu açmalı.
  const wrapped = { fetchedAt: '2026-08-05T00:00:00.000Z', data: fx('catalog') }
  const r = validateWorkflow(fx('workflow-valid'), { catalog: unwrapCatalog(wrapped) })
  assert.deepEqual(r.errors, [])
})

test('zarfsiz katalog bozulmadan gecer', () => {
  const r = validateWorkflow(fx('workflow-valid'), { catalog: unwrapCatalog(fx('catalog')) })
  assert.deepEqual(r.errors, [])
})

test('unwrapCatalog null girdiyi tolere eder', () => {
  assert.equal(unwrapCatalog(null), null)
})

test('display dugumu app gerektirmez', () => {
  const r = validateWorkflow(fx('workflow-valid'), { catalog: fx('catalog') })
  assert.ok(!has(r, ERROR.UNKNOWN_ENDPOINT, 'output'))
})

test('app alani eksik run dugumu yakalanir', () => {
  const wf = fx('workflow-valid')
  delete wf.contents.nodes['node-hero'].app
  assert.ok(has(validateWorkflow(wf, { catalog: fx('catalog') }), ERROR.UNKNOWN_ENDPOINT, 'node-hero'))
})
