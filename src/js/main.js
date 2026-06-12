import '../css/style.css'
// =============================================
// WUBB PORTFOLIO — MAIN
// Charles Blackwood | Strictly Mobile Dev
// =============================================

import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import { FACES } from './faces.js'

// ── SCENE SETUP ────────────────────────────────
const canvas   = document.getElementById('canvas')
canvas.setAttribute('tabindex', '0')
canvas.setAttribute('aria-label', 'Interactive portfolio cube')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0

const scene  = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0.5, 8)
camera.lookAt(0, 0, 0)

// ── GRADIENT BACKGROUND ───────────────────────
const bgScene  = new THREE.Scene()
const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

const bgGeometry = new THREE.PlaneGeometry(2, 2)
const bgMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vec3 colA = vec3(0.79, 0.72, 0.94); // lavender
      vec3 colB = vec3(0.66, 0.90, 0.81); // mint
      vec3 colC = vec3(1.00, 0.83, 0.71); // peach
      float t = vUv.y + sin(vUv.x * 3.14 + uTime * 0.3) * 0.1;
      vec3 col = mix(colC, mix(colA, colB, vUv.x), t);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
  uniforms: { uTime: { value: 0 } },
  depthWrite: false
})
bgScene.add(new THREE.Mesh(bgGeometry, bgMaterial))

// ── ENVIRONMENT (for glass refraction) ────────
const pmremGenerator = new THREE.PMREMGenerator(renderer)
pmremGenerator.compileEquirectangularShader()
const envTexture = pmremGenerator.fromScene(bgScene).texture
scene.environment = envTexture

// ── LIGHTING ──────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.5)
sunLight.position.set(5, 8, 5)
sunLight.castShadow = true
sunLight.shadow.mapSize.set(1024, 1024)
scene.add(sunLight)

const fillLight = new THREE.DirectionalLight(0xC9B8F0, 0.6)
fillLight.position.set(-5, 2, -3)
scene.add(fillLight)

// ── TOON CUBE ─────────────────────────────────
const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back']

const cubeGeo = new RoundedBoxGeometry(2, 2, 2, 4, 0.24)

const cubeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xF0A030,
    metalness: 0,
    roughness: 0.08,
    transmission: 0.92,
    thickness: 0.6,
    ior: 1.45,
    attenuationColor: new THREE.Color(0xF5820A),
    attenuationDistance: 3.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide
})

cubeMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = { value: 0 }
  cubeMaterial._shader = shader
  shader.vertexShader = `
    uniform float uTime;

    vec3 mod289(vec3 x){ return x - floor(x*(1./289.))*289.; }
    vec4 mod289(vec4 x){ return x - floor(x*(1./289.))*289.; }
    vec4 permute(vec4 x){ return mod289(((x*34.)+1.)*x); }
    vec4 taylorInvSqrt(vec4 r){ return 1.7928429-.8537347*r; }
    float snoise(vec3 v){
      const vec2 C = vec2(1./6., 1./3.);
      const vec4 D = vec4(0., .5, 1., 2.);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1. - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0., i1.z, i2.z, 1.))
        + i.y + vec4(0., i1.y, i2.y, 1.))
        + i.x + vec4(0., i1.x, i2.x, 1.));
      float n_ = .142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49. * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7. * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1. - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.+1.;
      vec4 s1 = floor(b1)*2.+1.;
      vec4 sh = -step(h, vec4(0.));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.);
      m = m*m;
      return 42. * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }
  ` + shader.vertexShader

  shader.vertexShader = shader.vertexShader.replace(
    `#include <begin_vertex>`,
    `#include <begin_vertex>
    float noise = snoise(position * 1.8 + uTime * 0.3);
    transformed += normal * noise * 0.045;`
  )
}

const cube = new THREE.Mesh(cubeGeo, cubeMaterial)
cube.castShadow = true
cube.receiveShadow = true
scene.add(cube)

// Shadow plane
const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.ShadowMaterial({ opacity: 0.15 })
)
shadowPlane.rotation.x = -Math.PI / 2
shadowPlane.position.y = -2
shadowPlane.receiveShadow = true
scene.add(shadowPlane)

// ── WUBB MODEL ────────────────────────────────
let wubb = null
let wubbMixer = null
let wubbOnCube = true
let wubbRunning = false
let originalWubbScale = 0.55

setTimeout(() => {
  if (!wubb) { createWubbPlaceholder(); hideLoadingScreen() }
}, 12000)

const loader = new GLTFLoader()
loader.load(`${import.meta.env.BASE_URL}models/wubb.glb`,
  (gltf) => {
    wubb = gltf.scene
    wubb.scale.setScalar(0.55)
    originalWubbScale = 0.55
    wubb.position.set(0, 1.65, 0)
    scene.add(wubb)

    // Animations
    if (gltf.animations.length > 0) {
      wubbMixer = new THREE.AnimationMixer(wubb)
      const idle = wubbMixer.clipAction(gltf.animations[0])
      idle.play()
    }

    hideLoadingScreen()
  },
  (progress) => {
    const loadingText = document.getElementById('loading-text')
    if (progress.total && loadingText) {
      const pct = Math.round((progress.loaded / progress.total) * 100)
      loadingText.textContent = `Loading Wubb... ${pct}%`
    }
  },
  (error) => {
    console.warn('Wubb model not found, using placeholder', error)
    createWubbPlaceholder()
    hideLoadingScreen()
  }
)

function createWubbPlaceholder() {
  const group = new THREE.Group()

  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.MeshToonMaterial({ color: 0xA8E6CF })
  )
  group.add(body)

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16)
  const eyeMat = new THREE.MeshToonMaterial({ color: 0xffffff })
  const leftEye  = new THREE.Mesh(eyeGeo, eyeMat)
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
  leftEye.position.set(-0.15, 0.08, 0.32)
  rightEye.position.set(0.15, 0.08, 0.32)
  group.add(leftEye, rightEye)

  // Pupils
  const pupilGeo = new THREE.SphereGeometry(0.07, 8, 8)
  const pupilMat = new THREE.MeshToonMaterial({ color: 0x6B3FA0 })
  const lp = new THREE.Mesh(pupilGeo, pupilMat)
  const rp = new THREE.Mesh(pupilGeo, pupilMat)
  lp.position.set(-0.15, 0.08, 0.43)
  rp.position.set(0.15, 0.08, 0.43)
  group.add(lp, rp)

  // Arms
  const armGeo = new THREE.CapsuleGeometry(0.04, 0.3, 4, 8)
  const armMat = new THREE.MeshToonMaterial({ color: 0xFFD3B6 })
  const leftArm  = new THREE.Mesh(armGeo, armMat)
  const rightArm = new THREE.Mesh(armGeo, armMat)
  leftArm.position.set(-0.45, 0.05, 0)
  rightArm.position.set(0.45, 0.05, 0)
  leftArm.rotation.z  =  0.5
  rightArm.rotation.z = -0.5
  group.add(leftArm, rightArm)

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.06, 0.2, 4, 8)
  const legMat = new THREE.MeshToonMaterial({ color: 0xFFD3B6 })
  const leftLeg  = new THREE.Mesh(legGeo, legMat)
  const rightLeg = new THREE.Mesh(legGeo, legMat)
  leftLeg.position.set(-0.15, -0.45, 0)
  rightLeg.position.set(0.15, -0.45, 0)
  group.add(leftLeg, rightLeg)

  group.position.set(0, 1.65, 0)
  wubb = group
  scene.add(wubb)
}

// ── CUBE DRAG ROTATION ───────────────────────
const faceDirections = [
  new THREE.Vector3( 1, 0, 0),  // right
  new THREE.Vector3(-1, 0, 0),  // left
  new THREE.Vector3( 0, 1, 0),  // top
  new THREE.Vector3( 0,-1, 0),  // bottom
  new THREE.Vector3( 0, 0, 1),  // front
  new THREE.Vector3( 0, 0,-1),  // back
]

let isDragging    = false
let prevMouse     = { x: 0, y: 0 }
let dragVelocity  = { x: 0, y: 0 }
let currentFace   = 4 // front faces camera initially
let isAnimating   = false
let dragThreshold = 5
let wasDragged = false

// Target rotation stored as euler angles
const targetEuler = new THREE.Euler(0, 0, 0, 'YXZ')

function getPointer(e) {
  if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  return { x: e.clientX, y: e.clientY }
}

canvas.addEventListener('pointerdown', (e) => {
  isDragging = true
  wasDragged = false
  prevMouse = getPointer(e)
  dragVelocity = { x: 0, y: 0 }
})

canvas.addEventListener('pointermove', (e) => {
  if (!isDragging) return
  const curr = getPointer(e)
  const dx = curr.x - prevMouse.x
  const dy = curr.y - prevMouse.y

  if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
    wasDragged = true
  }
  dragVelocity = { x: dx, y: dy }
  targetEuler.y += dx * 0.012
  targetEuler.x += dy * 0.012
  targetEuler.x  = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetEuler.x))
  cube.rotation.set(targetEuler.x, targetEuler.y, 0)
  if (wubb && wubbOnCube) syncWubbToCube()
  prevMouse = curr
})

canvas.addEventListener('pointerup', () => {
  if (!isDragging) return
  isDragging = false
  const speed = Math.sqrt(dragVelocity.x ** 2 + dragVelocity.y ** 2)

  if (speed > 18 && wubb && wubbOnCube) {
    launchWubb()
  } else {
    snapToNearestFace()
  }

  // Reset wasDragged on next tick so the upcoming 'click' event
  // (which fires after pointerup) can still read its current value
  setTimeout(() => { wasDragged = false }, 0)
})

canvas.addEventListener('pointercancel', () => {
  isDragging = false
})

function syncWubbToCube() {
  if (!wubb) return
  const top = new THREE.Vector3(0, 1, 0).applyEuler(cube.rotation)
  wubb.position.copy(top.multiplyScalar(1.65))
  wubb.rotation.copy(cube.rotation)
}

function snapToNearestFace() {
  if (isAnimating) return
  isAnimating = true

  // Find which face is most facing the camera (+Z world direction)
  const camDir = new THREE.Vector3(0, 0, 1)
  let bestDot  = -Infinity
  let bestFace = 4

  faceDirections.forEach((dir, i) => {
    const worldDir = dir.clone().applyEuler(cube.rotation)
    const dot      = worldDir.dot(camDir)
    if (dot > bestDot) { bestDot = dot; bestFace = i }
  })

  currentFace = bestFace

  // Snap rotation so that face is perfectly forward
  const snapRotations = {
    0: { x: 0,          y: -Math.PI / 2 }, // right
    1: { x: 0,          y:  Math.PI / 2 }, // left
    2: { x: -Math.PI/2, y: 0            }, // top
    3: { x:  Math.PI/2, y: 0            }, // bottom
    4: { x: 0,          y: 0            }, // front
    5: { x: 0,          y:  Math.PI     }, // back
  }

  const snap = snapRotations[bestFace]
  gsap.to(cube.rotation, {
    x: snap.x,
    y: snap.y,
    z: 0,
    duration: 0.5,
    ease: 'back.out(1.4)',
    onUpdate: () => { if (wubb && wubbOnCube) syncWubbToCube() },
    onComplete: () => {
      isAnimating = false
      targetEuler.set(snap.x, snap.y, 0)
      playSnapSound()
      reactWubb()
      showFaceLabel(bestFace)
    }
  })
}

// ── WUBB LAUNCH ───────────────────────────────
let wubbRunPos   = { x: 0, y: 0 }

function launchWubb() {
  if (!wubb || wubbRunning || isAnimating) return
  wubbOnCube  = false
  wubbRunning = true

  // Animate Wubb flying off
  gsap.to(wubb.position, {
    x: (Math.random() - 0.5) * 4,
    y: -0.5,
    z: 2.5,
    duration: 0.4,
    ease: 'power2.out',
    onComplete: () => {
      wubbRunPos = { x: wubb.position.x, y: -0.5 }
      runAroundScreen()
    }
  })

  snapToNearestFace()

  // Return after 4 seconds
  setTimeout(() => returnWubb(), 4000)
}

function runAroundScreen() {
  if (!wubb || !wubbRunning) return
  const targetX = (Math.random() - 0.5) * 5
  gsap.to(wubb.position, {
    x: targetX,
    duration: 0.8,
    ease: 'none',
    onComplete: () => { if (wubbRunning) runAroundScreen() }
  })
}

function returnWubb() {
  wubbRunning = false
  gsap.killTweensOf(wubb.position)

  gsap.to(wubb.position, {
    x: 0,
    y: 1.65,
    z: 0,
    duration: 0.6,
    ease: 'back.out(1.2)',
    onComplete: () => {
      wubbOnCube = true
      if (!isDragging) syncWubbToCube()
    }
  })
}

// ── WUBB IDLE REACTION ────────────────────────
function reactWubb() {
  if (!wubb || !wubbOnCube) return
  gsap.to(wubb.scale, {
    x: 1.2, y: 0.8, z: 1.2,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => wubb.scale.setScalar(originalWubbScale)
  })
}

// ── IDLE WUBB ANIMATION ──────────────────────
let idleTime = 0
function animateWubbIdle(delta) {
  if (!wubb || !wubbOnCube) return
  idleTime += delta
  // Gentle bob
  const baseY = 1.65
  wubb.position.y = baseY + Math.sin(idleTime * 2.5) * 0.05
  // Arm flail (applied to placeholder arms if no GLB)
  if (wubbMixer) wubbMixer.update(delta)
}

// ── FACE LABEL ────────────────────────────────
const hint = document.getElementById('hint')
let hintTimer = null

function showFaceLabel(faceIndex) {
  const key   = faceOrder[faceIndex]
  const face  = FACES[key]
  hint.textContent = face.label
  hint.classList.remove('hidden')
  clearTimeout(hintTimer)
  hintTimer = setTimeout(() => hint.classList.add('hidden'), 2000)
}

// ── FACE CLICK OPEN ───────────────────────────
const overlay     = document.getElementById('face-overlay')
const faceContent = document.getElementById('face-content')
const faceClose   = document.getElementById('face-close')

canvas.addEventListener('click', (e) => {

  if (overlay.classList.contains('visible')) return
  if (isAnimating) return

  if (isDragging || wasDragged) return
  const key  = faceOrder[currentFace]
  const face = FACES[key]
  openFace(face)
})

faceClose.addEventListener('click', closeFace)

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {

    if (overlay.classList.contains('visible')) {
      closeFace()
    }

  }
})

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    closeFace()
  }
})

window.addEventListener('keydown', (e) => {

  if (overlay.classList.contains('visible')) return

  const step = Math.PI / 2

  if (e.key === 'ArrowLeft') {
    targetEuler.y += step
    snapToNearestFace()
  }

  if (e.key === 'ArrowRight') {
    targetEuler.y -= step
    snapToNearestFace()
  }

})

function openFace(face) {
  faceContent.innerHTML = face.render()
  faceContent.scrollTop = 0
  overlay.classList.remove('hidden')
  overlay.classList.add('visible')
  faceClose.focus()
}

function closeFace() {
  overlay.classList.remove('visible')
  setTimeout(() => overlay.classList.add('hidden'), 400)
}

// ── SOUND ─────────────────────────────────────
let soundEnabled = true
const soundToggle = document.getElementById('sound-toggle')
const soundIcon   = document.getElementById('sound-icon')

soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled
  soundIcon.textContent = soundEnabled ? '🔊' : '🔇'
})

// Simple Web Audio click sound — created lazily on first interaction
// to satisfy mobile browser autoplay/audio policies
let audioCtx = null

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playSnapSound() {
  if (!soundEnabled) return
  const ctx    = getAudioCtx()
  const osc    = ctx.createOscillator()
  const gain   = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(520, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.08)
  gain.gain.setValueAtTime(0.18, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.12)
}

// Warm up audio context on first interaction
document.addEventListener('pointerdown', () => {
  getAudioCtx()
}, { once: true })

// ── LOADING SCREEN ───────────────────────────
function hideLoadingScreen() {
  const ls = document.getElementById('loading-screen')

  if (!ls) return
  ls.classList.add('fade-out')
  setTimeout(() => ls.remove(), 700)
  hint.textContent = 'Drag cube • Tap face to open'
  hint.classList.remove('hidden')
  setTimeout(() => hint.classList.add('hidden'), 3000)

  window.removeEventListener('resize', handleResize)
  window.addEventListener('resize', handleResize)
}

// ── RESIZE ────────────────────────────────────
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
}

window.addEventListener('resize', handleResize)

// ── RENDER LOOP ───────────────────────────────
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  if (document.hidden) return
  const delta = clock.getDelta()
  const elapsed = clock.getElapsedTime()

  bgMaterial.uniforms.uTime.value = elapsed
    if (cubeMaterial._shader) cubeMaterial._shader.uniforms.uTime.value = elapsed

  // Gentle cube float
  if (!isDragging && !isAnimating) {
    cube.position.y = Math.sin(elapsed * 1.2) * 0.06
  }

  animateWubbIdle(delta)

  renderer.autoClear = false
  renderer.clear()
  renderer.render(bgScene, bgCamera)
  renderer.render(scene, camera)
}

animate()
