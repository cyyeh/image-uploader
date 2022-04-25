window.onload = function() {
  // DOM element declarations
  const $UploadContainer = document.getElementById('uploader-container')
  const $FileInput = document.getElementById('file-input')
  const $LoadingContainer = document.getElementById('loading-container')
  const $UploadingResultContainer = document.getElementById('uploading-result-container')

  const API_ENDPOINT = 'https://image-uploader-cyyeh.netlify.app/.netlify/functions/upload-image'

  // DOM element event listener
  $FileInput.addEventListener('change', function() {
    $UploadContainer.style.display = 'none'
    $LoadingContainer.style.display = 'block'

    let photo = this.files[0]
    let formData = new FormData()
    formData.append('photo', photo)
    fetch(
      API_ENDPOINT,
      {
        method: 'POST',
        body: formData
      },
    )
      .then(response => response.json())
      .then(function(data) {
        console.log(data)
        $LoadingContainer.style.display = 'none'
        $UploadingResultContainer.style.display = 'block'
      })
      .catch(function(error) {
        console.lerror(error)
        $LoadingContainer.style.display = 'none'
        $UploadContainer.style.display = 'block'
      })
  }, false)
}
