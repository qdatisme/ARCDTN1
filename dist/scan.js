const $ = s => document.querySelector(s);
let activeId = null, cameraReady = false, audio = null, soundGeneration = 0;
const TRACKING_HOLD_MS = 3000;
const known = new Set(), markers = new Map(), holders = new Map(), failures = new Set();
const animalById = id => window.ANIMALS.find(a => a.id === id);
function stopSound() {
  soundGeneration++;
  if (audio) { audio.pause(); audio.currentTime = 0; audio = null; }
  $('#sound').textContent = 'Nghe tiếng kêu';
}
function refreshModelState() {
  if (activeId === null) return;
  const a = animalById(activeId), holder = holders.get(activeId);
  const ready = holder?.querySelector('[gltf-model]')?.dataset.ready === 'true';
  $('#hint').textContent = failures.has(activeId) ? 'Không tải được mô hình. Kiểm tra file GLB trong thư mục assets/models rồi tải lại trang.' : ready ? 'Đã nhận thẻ ' + a.id + '. Khi đổi thẻ, đưa thẻ cũ ra khỏi hình khoảng 1 giây.' : 'Đã nhận thẻ ' + a.id + ' · Đang tải mô hình…';
}
function chooseActive(visibleIds = known) {
  // Keep the current animal stable when several markers are visible.
  const next = visibleIds.has(activeId) ? activeId :
    (visibleIds.values().next().value ?? (known.has(activeId) ? activeId : null));
  if (next === activeId) return;
  stopSound();
  activeId = next;
  for (const [id, holder] of holders) holder.object3D.visible = id === activeId;
  document.dispatchEvent(new CustomEvent('ar-tracking', {detail: {found: activeId !== null, id: activeId}}));
  $('#controls').classList.toggle('hidden', activeId === null);
  if (activeId === null) {
    $('#status').textContent = cameraReady ? 'Đang tìm thẻ…' : 'Đang khởi động camera…';
    $('#title').textContent = 'Tìm thẻ động vật';
    $('#hint').textContent = 'Hướng camera vào một thẻ có viền đen. Thử khoảng cách 25–50 cm và giữ đủ sáng.';
    return;
  }
  const a = animalById(activeId);
  const model = holders.get(activeId)?.querySelector('[data-model-source]');
  if (model && !model.hasAttribute('gltf-model')) model.setAttribute('gltf-model', model.dataset.modelSource);
  $('#view360').href = 'preview.html?id=' + a.id + '&from=ar';
  $('#status').textContent = '● Thẻ ' + a.id + ' · ' + a.name;
  $('#title').textContent = a.name;
  $('#latin').textContent = a.latin;
  $('#intro').textContent = a.intro;
  $('#habitat').textContent = a.habitat;
  $('#sound-note').textContent = a.soundNote;
  refreshModelState();
}
$('#info').onclick = () => {
  const hidden = $('#details').classList.toggle('hidden');
  $('#info').setAttribute('aria-expanded', String(!hidden));
  $('#info').textContent = hidden ? 'Thông tin' : 'Ẩn thông tin';
};
$('#sound').onclick = async () => {
  if (activeId === null) return;
  if (audio) { stopSound(); return; }
  const id = activeId, a = animalById(id), local = new Audio(a.audio);
  const generation = ++soundGeneration;
  audio = local;
  local.volume = 0.7;
  $('#sound').textContent = 'Dừng tiếng kêu';
  $('#error').textContent = '';
  local.onended = () => { if (generation === soundGeneration) stopSound(); };
  try { await local.play(); }
  catch (e) { if (generation === soundGeneration && activeId === id) { stopSound(); $('#error').textContent = 'Không phát được tiếng kêu. Kiểm tra file âm thanh hoặc thử chạm lại nút.'; } }
};
try {
  if (!window.AFRAME) throw Error('Không tải được thư viện AR. Kiểm tra thư mục vendor rồi tải lại.');
  if (!isSecureContext) throw Error('Camera cần HTTPS hoặc localhost. Trên iPhone, hãy mở ứng dụng bằng địa chỉ HTTPS.');
  // AR.js 3.4.7 exposes registered patterns here. Wait for the full database
  // before accepting any match; otherwise the first loaded pattern can win briefly.
  const samples = new Map();
  let lastProcessedAt = null;
  AFRAME.registerComponent('animal-selection', {
    tick: function () {
      const context = this.el.systems.arjs?._arSession?.arContext;
      const controller = context?.arController;
      if (Object.keys(controller?.patternMarkers || {}).filter(k => Number(k) >= 0).length < window.ANIMALS.length) return;
      // Count detector frames, not render ticks (the same result can span ticks).
      if (context._updatedAt == null || context._updatedAt === lastProcessedAt) return;
      lastProcessedAt = context._updatedAt;
      const now = performance.now();
      const visibleIds = new Set();
      for (const [id, marker] of markers) {
        const raw = context._arMarkersControls.find(c => c.parameters.patternUrl?.endsWith('/' + id + '.patt'));
        const previous = samples.get(id);
        if (raw?.object3d.visible) {
          // Confirm twice within 200 ms; a single missed frame need not restart acquisition.
          const hits = previous && now - previous.lastSeen <= 200 ? previous.hits + 1 : 1;
          samples.set(id, {lastSeen: now, hits});
          if (hits >= 2) known.add(id);
          if (known.has(id)) {
            visibleIds.add(id);
            // Models are scene children so AR.js cannot hide them on a missed frame.
            // Copy only the anchor transform; model rotation/zoom stays on its child.
            marker.object3D.updateWorldMatrix(true, false);
            const holder = holders.get(id).object3D;
            marker.object3D.matrixWorld.decompose(holder.position, holder.quaternion, holder.scale);
          }
        } else if (previous && now - previous.lastSeen > TRACKING_HOLD_MS) {
          samples.delete(id);
          known.delete(id);
        }
      }
      chooseActive(visibleIds);
    }
  });
  const scene = document.createElement('a-scene');
  scene.setAttribute('animal-selection', '');
  scene.setAttribute('embedded', '');
  scene.setAttribute('xr-mode-ui', 'enabled: false');
  scene.setAttribute('vr-mode-ui', 'enabled: false');
  scene.setAttribute('renderer', 'alpha: true; antialias: true; colorManagement: true');
  scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; detectionMode: mono; sourceWidth: 1280; sourceHeight: 960; canvasWidth: 640; canvasHeight: 480; maxDetectionRate: 30; cameraParametersUrl: vendor/camera_para.dat;');
  for (const a of window.ANIMALS) {
    const marker = document.createElement('a-marker');
    marker.setAttribute('type', 'pattern');
    marker.setAttribute('url', 'assets/markers/' + a.id + '.patt');
    marker.setAttribute('size', '0.1');
    marker.setAttribute('emitevents', 'true');
    marker.setAttribute('smooth', 'true');
    marker.setAttribute('min-confidence', '0.75');
    const holder = document.createElement('a-entity');
    holder.id = 'animal-model-' + a.id;
    const model = document.createElement('a-entity');
    model.dataset.animalId = String(a.id); model.setAttribute('rotation', '0 ' + (a.modelYaw || 35) + ' 0');
    model.setAttribute('fit-animal', 'size: 1.0');
    model.dataset.modelSource = a.model;
    model.addEventListener('model-error', () => { failures.add(a.id); refreshModelState(); });
    model.addEventListener('animal-ready', () => { failures.delete(a.id); refreshModelState(); });
    holder.object3D.visible = false;
    holder.append(model); scene.append(marker); scene.append(holder);
    markers.set(a.id, marker); holders.set(a.id, holder);
  }
  const camera = document.createElement('a-entity');camera.setAttribute('camera', '');scene.append(camera);
  const ambient = document.createElement('a-light');ambient.setAttribute('type','ambient');ambient.setAttribute('intensity','0.55');scene.append(ambient);
  const light = document.createElement('a-light');light.setAttribute('type','directional');light.setAttribute('position','-2 4 3');light.setAttribute('intensity','0.8');scene.append(light);
  document.body.append(scene);
  window.addEventListener('camera-init', () => { cameraReady = true; $('#error').textContent = ''; if (activeId === null) $('#status').textContent = 'Đang tìm thẻ…'; });
  window.addEventListener('camera-error', () => { $('#error').textContent = 'Không mở được camera. Cho phép Camera cho trang này, đóng ứng dụng đang dùng camera rồi tải lại.'; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopSound(); });
  window.addEventListener('pagehide', () => { stopSound(); document.querySelectorAll('video').forEach(v => v.srcObject?.getTracks().forEach(t => t.stop())); });
} catch (e) { $('#error').textContent = e.message; $('#status').textContent = 'Chưa khởi động được'; }
