<template>
  <div class="from-container">
    <div class="footer-container">
      <NewFooter />
    </div>

    <div class="footerandsponsor-container">
      <!-- ===== Footer form ===== -->
      <div class="footer-form">
        <label class="footer-label">Footer Text (Default)</label>
        <input type="text" v-model="footer.text" placeholder="Enter footer text" class="footer-input" required />

        <label class="footer-label">Footer Text (English)</label>
        <input type="text" v-model="footer.text_en" placeholder="Enter footer text in English" class="footer-input"
          required />

        <label class="footer-label">Footer Credit</label>
        <input type="text" v-model="footer.credit" placeholder="Enter footer credit" class="footer-input" required />

        <label class="footer-label">Footer Credit (English)</label>
        <input type="text" v-model="footer.credit_en" placeholder="Enter footer credit in English" class="footer-input"
          required />

        <button @click="saveFooter" class="footer-button">Save change</button>
      </div>

      <!-- ===== Sponsors admin ===== -->
      <div style="flex:1">
        <h2 style="margin: 0 0 12px 0;">Sponsors (สูงสุด 4)</h2>
        <p style="margin:4px 0 12px; color:#666;">
          <b>{{ sponsorList.length }}</b> / 4
          <span v-if="!canAddSponsor"> — ไม่สามารถเพิ่มได้แล้ว</span>
        </p>

        <!-- Add button -->
        <div class="footer-add">
          <small v-if="!canAddSponsor" style="color:#c00;">* ครบ 4 แล้ว ไม่สามารถเพิ่มได้</small>
          <button class="footer-button" type="button" @click="openAddModal" :disabled="!canAddSponsor"
            :title="!canAddSponsor ? 'ครบ 4 รายแล้ว' : 'เพิ่ม Sponsor'">
            เพิ่ม Sponsor
          </button>
        </div>

        <!-- Cropper modal -->
        <div v-if="showCropper" class="modal-overlay" @click.self="cancelCrop()">
          <div class="modal-body" style="width:min(90vw, 720px);">
            <div class="modal-header">
              <h3>Crop Logo</h3>
              <button class="modal-close" @click="cancelCrop()" aria-label="Close">✕</button>
            </div>
            <div class="modal-content" style="max-height:60vh;">
              <img ref="cropperImage" :src="croppingImage" alt="to-crop" style="max-width:100%; display:block;">
            </div>
            <div class="modal-footer" style="display:flex; gap:8px; justify-content:flex-end;">
              <button class="footer-button" @click="cropImage">Use this crop</button>
              <button class="footer-button btn-ghost" @click="cancelCrop()">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Add Sponsor Modal -->
        <div v-if="showAddModal" class="modal-overlay-l" @click.self="closeAddModal" aria-modal="true" role="dialog"
          aria-labelledby="add-sponsor-title">
          <div class="modal-body" ref="addModalRef">
            <div class="modal-header">
              <h3 id="add-sponsor-title">Add Sponsor</h3>
              <button class="modal-close" @click="closeAddModal" aria-label="Close">✕</button>
            </div>

            <div class="modal-content">
              <div class="footer-form" style="max-width: 100%; margin:0;">
                <div class="grid-2">
                  <div>
                    <label class="footer-label">Logo</label>
                    <div class="footer-image-upload">
                      <img v-if="!logoPreview" src="/icon/upload.svg" alt="upload icon">
                      <img v-else :src="logoPreview" alt="logo preview"
                        style="height:50px; max-width:180px; object-fit:contain; background:#fff; border:1px solid #eee; padding:4px; border-radius:8px;">
                      <h3>อัพโหลดรูปภาพไม่เกิน 25 Mb</h3>
                      <p>PNG, JPEG, GIF</p>
                      <button class="footer-button" type="button" @click="triggerFileInput">
                        {{ logoPreview ? 'เปลี่ยนรูป' : 'อัพโหลดรูป' }}
                      </button>
                      <input ref="logoFileInput" type="file" accept="image/*" @change="handleFileChange"
                        style="display:none;">
                    </div>
                  </div>

                  <div>
                    <label class="footer-label">Name</label>
                    <input v-model="createForm.alt" class="footer-input" placeholder="Sponsor name" />
                    <label class="footer-label">Link URL</label>
                    <input v-model="createForm.url" class="footer-input" placeholder="https://sponsor.com" />
                    <button class="footer-button" style="width: 100%; margin-top:8px;" @click="onCreateSponsorAndClose">
                      Add sponsor
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        <!-- Sponsors table -->
        <div class="table-wrap">
          <table class="sponsors-table">
            <thead>
              <tr>
                <th style="width:60px;">#</th>
                <th>ID</th>
                <th>Logo</th>
                <th>Name</th>
                <th>URL</th>
                <th>Create at</th>
                <th style="width: 220px;">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="sLoading">
                <td data-label="Status" colspan="7" style="text-align:center; padding:16px;">Loading sponsors...</td>
              </tr>

              <tr v-else-if="sError">
                <td data-label="Error" colspan="7" style="color:#c00;">{{ sError }}</td>
              </tr>

              <tr v-else v-for="(sp, idx) in orderedSponsors" :key="sp.id" draggable="true"
                @dragstart="onDragStart(idx, $event)" @dragover.prevent="onDragOver(idx, $event)"
                @drop.prevent="onDrop(idx, $event)"
                :class="{ 'dragging': dragState.dragIndex === idx, 'drag-over': dragState.overIndex === idx }">

                <!-- ลำดับ + handle + Up/Down -->
                <td data-label="Order">
                  <div class="order-cell">
                    <button class="handle" title="Drag to reorder" aria-label="Drag to reorder">⠿</button>
                    <div class="order-controls">
                      <button class="mini-btn" :disabled="idx === 0" @click="moveUp(idx)">↑</button>
                      <button class="mini-btn" :disabled="idx === orderedSponsors.length - 1"
                        @click="moveDown(idx)">↓</button>
                    </div>
                  </div>
                </td>

                <td data-label="ID">{{ sp.id }}</td>

                <td data-label="Logo">
                  <template v-if="rowIsEditing(sp.id)">
                    <div class="logo-edit-box">
                      <!-- คลิกที่รูปก็เปิดไฟล์ -->
                      <div class="footer-image-wrap" @click="triggerEditFileInput( sp.id )">
                        <img class="footer-image-prev"  :src="editForm.logo" :alt="editForm.alt || 'sponsor'">
                      </div>

                      <!-- ช่องเลือกไฟล์ของแถวนี้ (ผูกตาม id) -->
                      <input :ref="el => setEditInputRef(sp.id, el as HTMLInputElement | null)" type="file"
                        accept="image/*" @change="handleFileChange" style="display:none;">
                    </div>
                  </template>
                  <template v-else>
                    <img :src="sp.logo" :alt="sp.alt || 'sponsor'"
                      style="height:42px; max-width:180px; object-fit:contain;" />
                  </template>
                </td>

                <td data-label="Name">
                  <template v-if="rowIsEditing(sp.id)">
                    <input v-model="editForm.alt" class="footer-input" placeholder="Alt / name" />
                  </template>
                  <template v-else>
                    {{ sp.alt || '—' }}
                  </template>
                </td>

                <td data-label="URL">
                  <template v-if="rowIsEditing(sp.id)">
                    <input v-model="editForm.url" class="footer-input" placeholder="https://..." />
                  </template>
                  <template v-else>
                    <a :href="sp.url" target="_blank" rel="noopener">{{ sp.url }}</a>
                  </template>
                </td>

                <td data-label="Create at">{{ formatDate(sp.created_at) }}</td>

                <td data-label="Actions">
                  <template v-if="rowIsEditing(sp.id)">
                    <div class="actions-wrap">
                      <button class="footer-button" @click="onSaveEdit(sp.id)">Save</button>
                      <button class="footer-button btn-danger" @click="onCancelEdit">Cancel</button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="actions-wrap">
                      <button class="footer-button" @click="onEditRow(sp)">Edit</button>
                      <button class="footer-button btn-danger" :disabled="!canDeleteSponsor"
                        :title="!canDeleteSponsor ? 'ไม่มีรายการให้ลบ' : 'Delete'" @click="onDeleteSponsor(sp.id)">
                        Delete
                      </button>
                    </div>
                  </template>
                </td>
              </tr>

              <tr v-if="!sLoading && sponsorList.length === 0">
                <td data-label="Status" colspan="7" style="text-align:center; padding:16px;">No sponsors yet</td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
      <!-- /Sponsors admin -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue'
import NewFooter from '~/components/NewFooter.vue'
import { useFooters } from '~/composables/useFooters'
import { useSponsors } from '~/composables/useSponsors'
import { useUpload } from '~/composables/useUpload'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

definePageMeta({ layout: 'admin' })

// ===== constants =====
const FOOTER_ID = 1
const MIN_SPONSORS = 0
const MAX_SPONSORS = 4

// ===== footer text =====
const { getFooterById, updateFooterById } = useFooters()
const footer = ref({
  text: '',
  text_en: '',
  credit: 'Copyright © Coconut Knowledge Hub สำนักวิชาเทคโนโลยีสารสนเทศ มหาวิทยาลัยแม่ฟ้าหลวง',
  credit_en: 'Copyright © Coconut Knowledge Hub Faculty of Information Technology, Mae Fah Luang University'
})

const fetchFooter = async () => {
  try {
    const data = await getFooterById(FOOTER_ID) as {
      text: string | null
      text_en: string | null
      credit: string | null
      credit_en: string | null
    }
    footer.value.text = data?.text || ''
    footer.value.text_en = data?.text_en || ''
    footer.value.credit = data?.credit || footer.value.credit
    footer.value.credit_en = data?.credit_en || footer.value.credit_en
  } catch (error) {
    console.error('Error fetching footer:', error)
  }
}

const saveFooter = async () => {
  try {
    await updateFooterById(
      FOOTER_ID,
      footer.value.text,
      footer.value.text_en,
      footer.value.credit,
      footer.value.credit_en
    )
    alert('Footer updated successfully!')
  } catch (error) {
    console.error('Error updating footer:', error)
    alert('Failed to update footer.')
  }
}

// ===== sponsors =====
type Sponsor = {
  id: number
  footer_id: number
  logo: string
  url: string
  alt?: string | null
  created_at?: string
  // อาจมี position จาก backend
  position?: number
}

const {
  sponsors, loading: sLoadingRef, error: sErrorRef,
  fetchSponsorsToState, createSponsor, updateSponsor, deleteSponsor,
  addSponsorToState, updateSponsorInState, removeSponsorFromState
} = useSponsors()

const { uploadImage } = useUpload()

const sLoading = computed(() => sLoadingRef.value)
const sError = computed(() => sErrorRef.value)
const sponsorList = computed<Sponsor[]>(() => sponsors.value[FOOTER_ID] || [])

// ปุ่มเพิ่ม/ลบ
const canAddSponsor = computed(() => sponsorList.value.length < MAX_SPONSORS)
const canDeleteSponsor = computed(() => sponsorList.value.length > MIN_SPONSORS)

// ===== Add form & upload/crop =====
const createForm = ref<{ logo: string; url: string; alt?: string }>({ logo: '', url: '', alt: '' })
const logoFileInput = ref<HTMLInputElement | null>(null)
const pendingLogoFile = ref<File | null>(null)
const logoPreview = computed(() => (pendingLogoFile.value ? URL.createObjectURL(pendingLogoFile.value) : createForm.value.logo || ''))

// ===== Cropper =====
const showCropper = ref(false)
const croppingImage = ref<string | null>(null)
const cropperImage = ref<HTMLImageElement | null>(null)
const cropperInstance = ref<Cropper | null>(null)

// ใช้ตัวเดียวกันทั้งสร้างและแก้
const fileTarget = ref<'create' | 'edit' | null>(null)

// ===== Reorder (เรียงตาม position ถ้ามี ไม่งั้นตาม id) =====
const orderedSponsors = computed<Sponsor[]>(() => {
  const list = [...sponsorList.value]
  return list.sort((a, b) => {
    const pa = Number.isFinite(a.position as number) ? (a.position as number) : a.id
    const pb = Number.isFinite(b.position as number) ? (b.position as number) : b.id
    return pa - pb
  })
})

// drag state
const dragState = ref<{ dragIndex: number | null; overIndex: number | null }>({ dragIndex: null, overIndex: null })

// ===== Refs: edit file input ต่อแถว (แก้ปัญหา ref ใน v-for) =====
const editInputsMap = ref<Record<number, HTMLInputElement | null>>({})
function setEditInputRef(id: number, el: HTMLInputElement | null) {
  editInputsMap.value[id] = el
}
function triggerEditFileInput(id: number) {
  fileTarget.value = 'edit'
  editInputsMap.value[id]?.click()
}

// ===== Helpers: apply positions & persist =====
function applyPositionsToState(newOrdered: Sponsor[]) {
  const posMap = new Map<number, number>()
  newOrdered.forEach((s, i) => posMap.set(s.id, s.position ?? i))
  sponsorList.value.forEach(sp => { sp.position = posMap.get(sp.id) ?? 0 })
}

async function persistChangedPositions(arr: Sponsor[]) {
  // อัปเดตเฉพาะที่ตำแหน่งเปลี่ยนจริง ๆ
  const jobs: Promise<any>[] = []
  arr.forEach((s, i) => {
    if (s.position !== i) {
      jobs.push(updateSponsor(s.id, { position: i } as any))
      s.position = i
    }
  })
  if (jobs.length) {
    await Promise.all(jobs)
    applyPositionsToState(arr.map(s => ({ ...s })))
  }
}

// ===== Reorder actions =====
const onDragStart = (idx: number, ev: DragEvent) => {
  dragState.value.dragIndex = idx
  ev.dataTransfer?.setData('text/plain', String(idx))
  ev.dataTransfer!.effectAllowed = 'move'
}

const onDragOver = (idx: number, $event: DragEvent) => { dragState.value.overIndex = idx }

const onDrop = async (idx: number, ev: DragEvent) => {
  const fromStr = ev.dataTransfer?.getData('text/plain')
  if (fromStr == null) return
  const from = parseInt(fromStr, 10)
  const to = idx
  dragState.value = { dragIndex: null, overIndex: null }
  if (Number.isNaN(from) || Number.isNaN(to) || from === to) return

  const arr = orderedSponsors.value.map(s => ({ ...s }))

  arr.forEach((s, i) => { s.position = Number.isFinite(s.position) ? s.position : i })

  const [moved] = arr.splice(from, 1)
  arr.splice(to, 0, moved)

  arr.forEach((s, i) => { s.position = i })
  applyPositionsToState(arr)
  await persistChangedPositions(arr)
}

const moveUp = async (idx: number) => {
  if (idx <= 0) return
  const arr = orderedSponsors.value.map(s => ({ ...s }))
  arr.forEach((s, i) => { if (!Number.isFinite(s.position)) s.position = i })
  // swap idx <-> idx-1
  const tmp = arr[idx - 1].position
  arr[idx - 1].position = arr[idx].position
  arr[idx].position = tmp
  // reindex
  arr.forEach((s, i) => { s.position = i })
  applyPositionsToState(arr)
  await persistChangedPositions(arr)
}

const moveDown = async (idx: number) => {
  const last = orderedSponsors.value.length - 1
  if (idx >= last) return
  const arr = orderedSponsors.value.map(s => ({ ...s }))
  arr.forEach((s, i) => { if (!Number.isFinite(s.position)) s.position = i })
  const tmp = arr[idx + 1].position
  arr[idx + 1].position = arr[idx].position
  arr[idx].position = tmp
  arr.forEach((s, i) => { s.position = i })
  applyPositionsToState(arr)
  await persistChangedPositions(arr)
}

// ===== File select triggers =====
const triggerFileInput = () => { fileTarget.value = 'create'; logoFileInput.value?.click() }

// ===== Cropper flow =====
const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 50 * 1024 * 1024) {
    alert('ไฟล์ต้องไม่เกิน 50MB')
    input.value = ''
    return
  }
  const fr = new FileReader()
  fr.onload = () => {
    croppingImage.value = fr.result as string
    showCropper.value = true
    nextTick(() => {
      cropperInstance.value = new Cropper(cropperImage.value!, {
        aspectRatio: 1,
        viewMode: 2,
        autoCropArea: 1
      })
    })
  }
  fr.readAsDataURL(file)
}

async function cropImage() {
  if (!cropperInstance.value) return
  const canvas = cropperInstance.value.getCroppedCanvas()
  if (!canvas) return alert('Crop failed')

  const blob: Blob | null = await new Promise(res => canvas.toBlob(b => res(b), 'image/webp', 0.95))
  if (!blob) return alert('Cannot create blob')

  if (fileTarget.value === 'create') {
    // โหมดสร้าง: เก็บไฟล์ไว้ก่อน
    pendingLogoFile.value = new File([blob], `sponsor_${Date.now()}.webp`, { type: 'image/webp' })
  } else if (fileTarget.value === 'edit') {
    // โหมดแก้ไข: อัปโหลดทันที แล้วอัปเดต + เซฟแถว
    const uploadName = `sponsor_${Date.now()}.webp`
    const resp = await uploadImage(new File([blob], uploadName, { type: 'image/webp' }), uploadName)
    const uploadResp = resp as { error?: string; path?: string }
    if (uploadResp?.error) {
      alert(uploadResp.error)
    } else {
      const logoPath = uploadResp.path || `/images/${uploadName}`
      editForm.value.logo = logoPath
      if (editingId.value != null) {
        try {
          await onSaveEdit(editingId.value)
        } catch (e: any) {
          console.error(e)
          alert(e?.message || 'Update failed')
        }
      }
    }
  }
  cancelCrop()
}

function cancelCrop(): void {
  showCropper.value = false
  cropperInstance.value?.destroy()
  cropperInstance.value = null
  fileTarget.value = null
}

// ===== Create =====
const onCreateSponsor = async () => {
  try {
    if (!canAddSponsor.value) return alert('ครบ 4 รายแล้ว ไม่สามารถเพิ่มได้')
    if (!createForm.value.url) return alert('กรุณากรอก URL')

    let logoPath = (createForm.value.logo || '').trim()
    if (pendingLogoFile.value) {
      const uploadName = `sponsor_${Date.now()}.webp`
      const resp = await uploadImage(pendingLogoFile.value, uploadName)
      const uploadResp = resp as { error?: string; path?: string }
      if (uploadResp?.error) throw new Error(uploadResp.error)
      logoPath = uploadResp.path || `/images/${uploadName}`
    }
    if (!logoPath) return alert('กรุณาอัปโหลดโลโก้หรือใส่ Logo URL')

    const sp = await createSponsor({
      footer_id: FOOTER_ID,
      logo: logoPath,
      url: createForm.value.url.trim(),
      alt: (createForm.value.alt || '').trim() || null
    })
    addSponsorToState(FOOTER_ID, sp)

    // reset
    createForm.value = { logo: '', url: '', alt: '' }
    pendingLogoFile.value = null
    if (logoFileInput.value) logoFileInput.value.value = ''
  } catch (e: any) {
    alert(e?.message || 'Create sponsor failed')
  }
}

// ===== Edit =====
const editingId = ref<number | null>(null)
const editForm = ref<{ logo: string; url: string; alt?: string | null }>({ logo: '', url: '', alt: '' })

const rowIsEditing = (id: number) => editingId.value === id
const onEditRow = (sp: Sponsor) => {
  editingId.value = sp.id
  editForm.value = { logo: sp.logo, url: sp.url, alt: sp.alt || '' }
}
const onCancelEdit = () => {
  editingId.value = null
  editForm.value = { logo: '', url: '', alt: '' }
}
const onSaveEdit = async (id: number) => {
  try {
    const updated = await updateSponsor(id, {
      logo: editForm.value.logo.trim(),
      url: editForm.value.url.trim(),
      alt: (editForm.value.alt || '').trim() || null
    })
    updateSponsorInState(FOOTER_ID, updated as Sponsor)
    onCancelEdit()
  } catch (e: any) {
    alert(e?.message || 'Update failed')
  }
}

// ===== Delete =====
const onDeleteSponsor = async (id: number) => {
  try {
    if (!canDeleteSponsor.value) return alert('ต้องคงไว้ขั้นต่ำ')
    await deleteSponsor(id, { footerId: FOOTER_ID, minCount: MIN_SPONSORS, enforceMin: true })
    removeSponsorFromState(FOOTER_ID, id)
  } catch (e: any) {
    alert(e?.message || 'Delete failed')
  }
}

// ===== Utils =====
const formatDate = (iso?: string) => {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch { return iso }
}

// ===== Add Modal =====
const showAddModal = ref(false)
const addModalRef = ref<HTMLDivElement | null>(null)

const openAddModal = () => {
  if (!canAddSponsor.value) return
  showAddModal.value = true
  createForm.value = { logo: '', url: '', alt: '' }
  pendingLogoFile.value = null
  if (logoFileInput.value) logoFileInput.value.value = ''
  document.documentElement.style.overflow = 'hidden'
}

const closeAddModal = () => {
  showAddModal.value = false
  document.documentElement.style.overflow = ''
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showAddModal.value) closeAddModal()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  watch(showAddModal, (v) => {
    if (v) {
      nextTick(() => {
        const input = addModalRef.value?.querySelector('input.footer-input') as HTMLInputElement | null
        input?.focus()
      })
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

const onCreateSponsorAndClose = async () => {
  const beforeCount = sponsorList.value.length
  await onCreateSponsor()
  const afterCount = sponsorList.value.length
  if (afterCount > beforeCount) closeAddModal()
}

// boot
onMounted(async () => {
  await fetchFooter()
  await fetchSponsorsToState(FOOTER_ID)
})
</script>


<style scoped>
/* DROP-IN: แถบเครื่องมือบันทึกลำดับ */
.order-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
  margin: 8px 0 12px;
}

.order-dirty-hint {
  color: #b35700;
}

/* ช่องลำดับ + handle + ปุ่มย่อย */
.order-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.handle {
  width: 28px;
  height: 28px;
  line-height: 26px;
  text-align: center;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #f7f7f7;
  cursor: grab;
  user-select: none;
}

.handle:active {
  cursor: grabbing;
}

.order-controls {
  display: inline-flex;
  gap: 6px;
}

.mini-btn {
  padding: 2px 8px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  line-height: 1.2;
}

.mini-btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}

/* เอฟเฟกต์ตอนลากวาง */
.dragging {
  opacity: .6;
}

/* กล่องห่อรูป เพื่อให้ ::after แสดงได้ */
.footer-image-wrap{
  position: relative;
  display: inline-block;
}

/* สไตล์รูปของคุณ */
.footer-image-prev{
  height: 42px;
  max-width: 180px;
  object-fit: contain;
  cursor: pointer;
  transition: .08s all ease-in-out;
  border-radius: 10px;
}

.footer-image-wrap:hover .footer-image-prev{
  outline: 3px solid #4E6D16;
  transform: scale(1.05);
}

/* tooltip bubble */
.footer-image-wrap::after{
  content: "คลิกเพื่อเปลี่ยนรูป";
  position: absolute;
  top: -40px;                 /* วางไว้เหนือรูป */
  left: 50%;
  transform: translateX(-50%) scale(.96);
  background: #4E6D16;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity .15s ease, transform .15s ease;
  box-shadow: 0 6px 16px rgba(0,0,0,.15);
}

/* ลูกศรของ tooltip */
.footer-image-wrap::before{
  content: "";
  position: absolute;
  top: -12px;                 /* ชิดใต้ bubble */
  left: 50%;
  transform: translateX(-50%);
  width: 0; height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #4E6D16;
  opacity: 0;
  transition: opacity .15s ease;
}

/* แสดงตอนโฟกัส/โฮเวอร์ */
.footer-image-wrap:hover::after,
.footer-image-wrap:hover::before,
.footer-image-wrap:focus-within::after,
.footer-image-wrap:focus-within::before{
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

/* จอเล็ก: ซ่อน tooltip เพื่อไม่บัง */
@media (max-width: 640px){
  .footer-image-wrap::after,
  .footer-image-wrap::before{ display:none; }
}


.drag-over {
  outline: 2px dashed #4E6D16;
}

/* ปุ่มเว้นระยะ Edit/Delete มากขึ้น (เดสก์ท็อป) */
.actions-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  justify-content: flex-start;
}

/* มือถือ: จัดกลางและยืดช่องว่างนิดหน่อย */
@media (max-width: 640px) {
  .actions-wrap {
    display: flex;
    justify-content: center;
    gap: 8px;
    width: 100%;
  }
}

/* Layout helpers */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Add button row */
.footer-add {
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  justify-content: right;
  align-items: center;
}

/* Buttons + variants */
.footer-button {
  padding: 8px 12px;
  font-size: .95rem;
  color: #fff;
  background-color: #4E6D16;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color .3s, opacity .3s, transform .02s;
}

.footer-button:hover {
  background-color: #3c550e;
}

.footer-button:active {
  transform: translateY(1px);
}

.footer-button:disabled {
  opacity: .5;
  cursor: not-allowed;
  color: #4E6D16;
  background-color: transparent;
  outline: #4E6D16 2px dotted;
  /* โทนเขียวอ่อนลงเวลาถูกปิด */
}

.btn-ghost {
  background: #aaa;
  color: #fff;
}

.btn-danger {
  background: #b63a3a;
}

.btn-danger:hover {
  background: #882a2a;
}

.btn-danger:disabled {
  opacity: .5;
  cursor: not-allowed;
}

/* Modal base */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  padding: 16px;
}

.modal-overlay-l {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

.modal-body {
  background: #fff;
  width: min(92vw, 820px);
  max-height: 90vh;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .2);
}

.modal-header,
.modal-footer {
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}

.modal-footer {
  border-top: 1px solid #eee;
  border-bottom: none;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-content {
  padding: 16px;
  overflow: auto;
}

.modal-close {
  border: none;
  background: transparent;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}

.modal-close:hover {
  background: #eee;
}

/* Upload box */
.footer-image-upload {
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  outline: #4E6D16 2px dashed;
  border-radius: 10px;
}

.footer-image-upload img {
  max-height: 8rem;
  min-height: 2rem;
  min-width: 2rem;
}

.footer-image-upload h3 {
  font-size: clamp(.5rem, 2.5vw, 1.1rem);
}

/* Table */
.table-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.sponsors-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.sponsors-table th,
.sponsors-table td {
  border-bottom: 1px solid #eee;
  padding: 10px;
  text-align: left;
}

.sponsors-table th {
  background: #f3f3f3;
}

.sponsors-table td a {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
}

/* Actions spacing (เพิ่มระยะห่าง Edit/Delete) */
.actions-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  /* << เว้นระยะมากขึ้น */
  width: 100%;
  justify-content: flex-start;
}

/* General layout */
.footerandsponsor-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  max-width: 1200px;
  margin: 20px auto;
}

.footer-container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .1);
}

.from-container {
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
}

.footer-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .1);
}

.footer-label {
  display: block;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  margin-top: 16px;
}

.footer-input {
  width: 100%;
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-bottom: 5px;
  transition: border-color .3s, box-shadow .3s;
}

.footer-input:focus {
  border-color: #4E6D16;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 59, 20, .3);
}

/* Responsive */
@media (max-width: 930px) {
  .footerandsponsor-container {
    flex-direction: column;
  }

  .footer-form {
    max-width: 100%;
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .modal-body {
    width: 96vw;
  }

  .sponsors-table,
  .sponsors-table thead,
  .sponsors-table tbody,
  .sponsors-table th,
  .sponsors-table td,
  .sponsors-table tr {
    display: block;
  }

  .sponsors-table thead {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .sponsors-table {
    border: 0;
    background: transparent;
  }

  .sponsors-table tr {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    margin-bottom: 12px;
    padding: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .04);
  }

  .sponsors-table td {
    border: none;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
    padding: 10px 12px 10px 44%;
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sponsors-table td:last-child {
    border-bottom: 0;
  }

  .sponsors-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 12px;
    top: 10px;
    width: 40%;
    white-space: nowrap;
    font-weight: 600;
    color: #555;
  }

  .sponsors-table td img {
    max-height: 36px;
    height: auto;
    width: auto;
  }

  /* Actions on mobile */
  .actions-wrap {
    display: flex;
    justify-content: center;
    gap: 8px;
    width: 100%;
  }
}
</style>
