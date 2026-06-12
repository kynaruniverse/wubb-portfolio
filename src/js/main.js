// =============================================
// WUBB PORTFOLIO — MAIN
// Charles Blackwood | Strictly Mobile Dev
// =============================================

import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import { FACES } from './faces.js'

// ── SCENE SETUP ────────────────────────────────
const canvas   = document.getElementById('canvas')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene  = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 1.5, 6)
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

const cubeGeo  = new THREE.BoxGeometry(2.4, 2.4, 2.4, 1, 1, 1)
const cubeMats = faceOrder.map(faceKey => {
  const face = FACES[faceKey]
  return new THREE.MeshToonMaterial({
    color: face.color,
    side: THREE.FrontSide
  })
})

const cube = new THREE.Mesh(cubeGeo, cubeMats)
cube.castShadow = true
cube.receiveShadow = true
scene.add(cube)

// Chunky outline
const outlineGeo = new THREE.BoxGeometry(2.52, 2.52, 2.52)
const outlineMat = new THREE.MeshBasicMaterial({ color: 0x2D1B69, side: THREE.BackSide })
const outline    = new THREE.Mesh(outlineGeo, outlineMat)
cube.add(outline)

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

const loader = new GLTFLoader()
loader.load('./assets/models/wubb.glb',
  (gltf) => {
    wubb = gltf.scene
    wubb.scale.setScalar(0.55)
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
    console.log('Loading Wubb...', Math.round(progress.loaded / progress.total * 100) + '%')
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
let dragThreshold = 5 // px before it counts as a drag

// Target rotation stored as euler angles
const targetEuler = new THREE.Euler(0, 0, 0, 'YXZ')

function getPointer(e) {
  if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  return { x: e.clientX, y: e.clientY }
}

canvas.addEventListener('pointerdown', (e) => {
  isDragging = true
  prevMouse  = getPointer(e)
  dragVelocity = { x: 0, y: 0 }
})

canvas.addEventListener('pointermove', (e) => {
  if (!isDragging) return
  const curr = getPointer(e)
  const dx   = curr.x - prevMouse.x
  const dy   = curr.y - prevMouse.y
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
let wubbRunDir   = 1
let wubbRunTime  = 0

function launchWubb() {
  if (!wubb || wubbRunning) return
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
  wubbRunDir = Math.random() > 0.5 ? 1 : -1
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
      syncWubbToCube()
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
    onComplete: () => wubb.scale.setScalar(0.55)
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
  if (isDragging) return
  const key  = faceOrder[currentFace]
  const face = FACES[key]
  openFace(face)
})

faceClose.addEventListener('click', closeFace)

function openFace(face) {
  faceContent.innerHTML = face.render()
  overlay.classList.remove('hidden')
  overlay.classList.add('visible')
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

// Simple Web Audio click sound
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

function playSnapSound() {
  if (!soundEnabled) return
  const osc    = audioCtx.createOscillator()
  const gain   = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.frequency.setValueAtTime(520, audioCtx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(280, audioCtx.currentTime + 0.08)
  gain.gain.setValueAtTime(0.18, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12)
  osc.start(audioCtx.currentTime)
  osc.stop(audioCtx.currentTime + 0.12)
}

// Resume audio context on first interaction
document.addEventListener('pointerdown', () => {
  if (audioCtx.state === 'suspended') audioCtx.resume()
}, { once: true })

// ── LOADING SCREEN ───────────────────────────
function hideLoadingScreen() {
  const ls = document.getElementById('loading-screen')
  ls.classList.add('fade-out')
  setTimeout(() => ls.remove(), 700)
  hint.textContent = 'Drag the cube to spin it'
  hint.classList.remove('hidden')
  setTimeout(() => hint.classList.add('hidden'), 3000)
}

// ── RESIZE ────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ── RENDER LOOP ───────────────────────────────
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  const elapsed = clock.getElapsedTime()

  bgMaterial.uniforms.uTime.value = elapsed

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
