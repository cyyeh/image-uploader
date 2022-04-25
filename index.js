window.onload = function() {
  // DOM element declarations
  const $UploadContainer = document.getElementById('uploader-container')
  const $DragDropContainer = document.getElementById('drag-drop-container')
  const $FileInput = document.getElementById('file-input')
  const $LoadingContainer = document.getElementById('loading-container')
  const $UploadingResultContainer = document.getElementById('uploading-result-container')
  const $UploadedImage = document.querySelector('.uploaded-img')

  const API_ENDPOINT = `${document.location.origin}/.netlify/functions/upload-image`

  const convertFile = (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = () => {
        reject(reader.error)
      }
      reader.readAsDataURL(file)
    })
  }

  const handlePhotoUpload = async (photo) => {
    $UploadContainer.style.display = 'none'
    $LoadingContainer.style.display = 'block'

    const base64Str = await convertFile(photo)
    fetch(
      API_ENDPOINT,
      {
        method: 'POST',
        body: JSON.stringify({
          "name": photo.name,
          "base64": base64Str
        })
      },
    )
      .then(response => response.json())
      .then(function(data) {
        console.log(data)
        $UploadedImage.style.backgroundImage = `url(${data.base64})`
        $LoadingContainer.style.display = 'none'
        $UploadingResultContainer.style.display = 'block'
      })
      .catch(function(error) {
        console.error(error)
        $LoadingContainer.style.display = 'none'
        $UploadContainer.style.display = 'block'
      })
  }

  // DOM element event listener
  $DragDropContainer.addEventListener('dragenter', function(e) {
    e.stopPropagation()
    e.preventDefault()
  }, false)

  $DragDropContainer.addEventListener('dragover', function(e) {
    e.stopPropagation()
    e.preventDefault()
  }, false)

  $DragDropContainer.addEventListener('drop', async function(e) {
    e.stopPropagation()
    e.preventDefault()

    const data = e.dataTransfer
    const photo = data.files[0]
    await handlePhotoUpload(photo)
  }, false)

  $FileInput.addEventListener('change', async function() {
    const photo = this.files[0]
    await handlePhotoUpload(photo)
  }, false)
}
