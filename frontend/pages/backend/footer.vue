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
        <input type="text" v-model="footer.text_en" placeholder="Enter footer text in English" class="footer-input" required />

        <label class="footer-label">Footer Credit</label>
        <input type="text" v-model="footer.credit" placeholder="Enter footer credit" class="footer-input" required />

        <label class="footer-label">Footer Credit (English)</label>
        <input type="text" v-model="footer.credit_en" placeholder="Enter footer credit in English" class="footer-input" required />

        <button @click="saveFooter" class="footer-button">Save change</button>
      </div>

      <!-- ===== Sponsors admin ===== -->
      <div style="flex:1">
        <h2 style="margin: 0 0 12px 0;">Sponsors (Max 4)</h2>
        <p style="margin:4px 0 12px; color:#666;">
          Current: <b>{{ sponsorList.length }}</b> / 4
          <span v-if="!canAddSponsor"> — limit reached</span>
        </p>

        <!-- Add new sponsor -->
        <div class="footer-form" style="max-width: 100%; margin-bottom: 16px;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label class="footer-label">Logo</label>

              <!-- preview -->
              <div style="display:flex; align-items:center; gap:12px;">
                <img :src="logoPreview" alt="logo preview"
                     style="height:50px; max-width:180px; object-fit:contain; background:#fff; border:1px solid #eee; padding:4px; border-radius:8px;">
                <button class="footer-button" type="button" @click="triggerFileInput" :disabled="!canAddSponsor">Upload & Crop</button>
                <input ref="logoFileInput" type="file" accept="image/*" @change="handleFileChange" style="display:none;">
              </div>

              <!-- or direct URL (fallback) -->
              <input v-model="createForm.logo" class="footer-input" placeholder="/img/logo.png or https://..." style="margin-top:8px;" />
              <small style="color:#777;">*ใส่ URL โดยตรง หรือใช้ Upload & Crop ก็ได้ (ถ้าอัปโหลดสำเร็จจะใช้ไฟล์ที่อัปโหลดเป็นหลัก)</small>
            </div>

            <div>
              <label class="footer-label">Link URL</label>
              <input v-model="createForm.url" class="footer-input" placeholder="https://sponsor.com" />
              <label class="footer-label">Alt / Name</label>
              <input v-model="createForm.alt" class="footer-input" placeholder="Sponsor name" />
              <button class="footer-button" style="width: 100%; margin-top:8px;"
                      @click="onCreateSponsor" :disabled="!canAddSponsor">
                Add sponsor
              </button>
              <small v-if="!canAddSponsor" style="color:#c00;">* ครบ 4 แล้ว ไม่สามารถเพิ่มได้</small>
            </div>
          </div>
        </div>

        <!-- Cropper modal -->
        <div v-if="showCropper" style="position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:1000;">
          <div style="background:#fff; padding:16px; border-radius:12px; width:min(90vw, 720px);">
            <h3 style="margin-bottom:8px;">Crop Logo</h3>
            <div style="max-height:60vh; overflow:auto;">
              <img ref="cropperImage" :src="croppingImage" alt="to-crop" style="max-width:100%; display:block;">
            </div>
            <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
              <button class="footer-button" @click="cropImage">Use this crop</button>
              <button class="footer-button" style="background:#aaa" @click="cancelCrop">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Sponsors table -->
        <table class="sponsors-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Logo</th>
              <th>Alt / Name</th>
              <th>URL</th>
              <th>Create at</th>
              <th style="width: 160px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="sLoading">
              <td colspan="6" style="text-align:center; padding:16px;">Loading sponsors...</td>
            </tr>

            <tr v-else-if="sError">
              <td colspan="6" style="color:#c00;">{{ sError }}</td>
            </tr>

            <tr v-else v-for="sp in sponsorList" :key="sp.id">
              <td>{{ sp.id }}</td>
              <td>
                <img :src="rowIsEditing(sp.id) ? editForm.logo : sp.logo" :alt="sp.alt || 'sponsor'"
                     style="height:42px; max-width:180px; object-fit:contain;" />
              </td>
              <td>
                <template v-if="rowIsEditing(sp.id)">
                  <input v-model="editForm.alt" class="footer-input" placeholder="Alt / name" />
                </template>
                <template v-else>
                  {{ sp.alt || '—' }}
                </template>
              </td>
              <td>
                <template v-if="rowIsEditing(sp.id)">
                  <input v-model="editForm.url" class="footer-input" placeholder="https://..." />
                </template>
                <template v-else>
                  <a :href="sp.url" target="_blank" rel="noopener">{{ sp.url }}</a>
                </template>
              </td>
              <td>{{ formatDate(sp.created_at) }}</td>
              <td>
                <template v-if="rowIsEditing(sp.id)">
                  <button class="footer-button" @click="onSaveEdit(sp.id)" style="margin-bottom:6px;">Save</button>
                  <button class="footer-button" @click="onCancelEdit" style="background:#aaa;">Cancel</button>
                </template>
                <template v-else>
                  <button class="footer-button" @click="onEditRow(sp)">Edit</button>
                  <button class="footer-button"
                          :disabled="!canDeleteSponsor"
                          :title="!canDeleteSponsor ? `ต้องคงไว้ 4 ราย` : 'Delete'"
                          @click="onDeleteSponsor(sp.id)">
                    Delete
                  </button>
                </template>
              </td>
            </tr>

            <tr v-if="!sLoading && sponsorList.length === 0">
              <td colspan="6" style="text-align:center; padding:16px;">No sponsors yet</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- /Sponsors admin -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
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

// ===== EXACT 4 rules =====
const canAddSponsor = computed(() => sponsorList.value.length < MAX_SPONSORS)
const canDeleteSponsor = computed(() => sponsorList.value.length > MIN_SPONSORS)

// ===== Add form & upload/crop =====
const createForm = ref<{ logo: string; url: string; alt?: string }>({
  logo: '',
  url: '',
  alt: ''
})

const logoFileInput = ref<HTMLInputElement | null>(null)
const pendingLogoFile = ref<File | null>(null)
const logoPreview = computed(() => {
  if (pendingLogoFile.value) return URL.createObjectURL(pendingLogoFile.value)
  return createForm.value.logo || '/img/placeholder-sponsor.png'
})

// cropper
const showCropper = ref(false)
const croppingImage = ref<string | null>(null)
const cropperImage = ref<HTMLImageElement | null>(null)
const cropperInstance = ref<Cropper | null>(null)

const triggerFileInput = () => logoFileInput.value?.click()

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

const cropImage = async () => {
  if (!cropperInstance.value) return
  const canvas = cropperInstance.value.getCroppedCanvas()
  if (!canvas) return alert('Crop failed')
  const blob: Blob | null = await new Promise(res =>
    canvas.toBlob(b => res(b), 'image/webp', 0.95)
  )
  if (!blob) return alert('Cannot create blob')
  pendingLogoFile.value = new File([blob], `sponsor_${Date.now()}.webp`, { type: 'image/webp' })
  showCropper.value = false
  cropperInstance.value?.destroy()
  cropperInstance.value = null
}

const cancelCrop = () => {
  showCropper.value = false
  cropperInstance.value?.destroy()
  cropperInstance.value = null
}

// create
const onCreateSponsor = async () => {
  try {
    if (!canAddSponsor.value) {
      return alert('ครบ 4 รายแล้ว ไม่สามารถเพิ่มได้')
    }
    if (!createForm.value.url) {
      return alert('กรุณากรอก URL')
    }

    // ถ้ามีไฟล์ที่ครอป → อัปโหลดก่อน
    let logoPath = (createForm.value.logo || '').trim()
    if (pendingLogoFile.value) {
      const uploadName = `sponsor_${Date.now()}.webp`
      const resp = await uploadImage(pendingLogoFile.value, uploadName)
      const uploadResp = resp as { error?: string; path?: string }
      if (uploadResp?.error) throw new Error(uploadResp.error)
      logoPath = uploadResp.path || `/images/${uploadName}`
    }
    if (!logoPath) {
      return alert('กรุณาอัปโหลดโลโก้หรือใส่ Logo URL')
    }

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

// ===== edit =====
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

// ===== delete =====
const onDeleteSponsor = async (id: number) => {
  try {
    if (!canDeleteSponsor.value) {
      return alert('ต้องคงไว้ 4 ราย')
    }
    await deleteSponsor(id, { footerId: FOOTER_ID, minCount: MIN_SPONSORS, enforceMin: true })
    removeSponsorFromState(FOOTER_ID, id)
  } catch (e: any) {
    alert(e?.message || 'Delete failed')
  }
}

// utils
const formatDate = (iso?: string) => {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch { return iso }
}

onMounted(async () => {
  await fetchFooter()
  await fetchSponsorsToState(FOOTER_ID)
})
</script>

<style scoped>
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.from-container {
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
}
.footer-form {
  max-width: 400px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 10px;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.footer-input:focus {
  border-color: #4E6D16;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 59, 20, 0.3);
}
.footer-button {
  margin-top: 8px;
  padding: 8px 12px;
  font-size: .95rem;
  color: #fff;
  background-color: #4E6D16;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.footer-button:hover { background-color: #3c550e; }
.sponsors-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}
.sponsors-table th, .sponsors-table td {
  border-bottom: 1px solid #eee;
  padding: 10px;
  text-align: left;
}
.sponsors-table th { background: #f3f3f3; }
</style>
