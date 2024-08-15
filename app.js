document.addEventListener('DOMContentLoaded', function () {
    const videoContainer = document.getElementById('videoContainer');
    let videos = JSON.parse(localStorage.getItem('videos')) || [];

    const loadVideos = () => {
        videoContainer.innerHTML = ''; // Clear container before loading
        videos.forEach((videoData, index) => {
            const videoItem = document.createElement('div');
            videoItem.classList.add('video-item');
            videoItem.dataset.index = index;

            const videoThumbnail = document.createElement('img');
            videoThumbnail.src = videoData.thumbnail || 'default-thumbnail.png';
            videoThumbnail.alt = videoData.title;

            const videoTitle = document.createElement('h3');
            videoTitle.textContent = videoData.title;

            const videoViews = document.createElement('p');
            videoViews.textContent = `${videoData.views || 0} views`;

            videoItem.appendChild(videoThumbnail);
            videoItem.appendChild(videoTitle);
            videoItem.appendChild(videoViews);

            videoItem.addEventListener('click', function () {
                videoData.views = (videoData.views || 0) + 1;
                localStorage.setItem('videos', JSON.stringify(videos));
                openVideoPlayer(videoData);
                videoViews.textContent = `${videoData.views} views`;
            });

            videoContainer.appendChild(videoItem);
        });
    };

    const openVideoPlayer = (videoData) => {
        document.getElementById('videoPlayerModal').style.display = 'block';
        document.getElementById('videoSource').src = videoData.url;
        document.getElementById('videoPlayer').load();
        document.getElementById('videoTitleDisplay').textContent = videoData.title;
        document.getElementById('videoViewsDisplay').textContent = `${videoData.views} views`;
        document.getElementById('videoDescriptionDisplay').textContent = videoData.description;
    };

    document.querySelector('#videoPlayerModal .close').addEventListener('click', function () {
        document.getElementById('videoPlayerModal').style.display = 'none';
        document.getElementById('videoSource').src = ''; // Stop video
    });

    // Handle upload modal
    const uploadButton = document.getElementById('uploadButton');
    const uploadForm = document.getElementById('uploadForm');
    const closeUploadForm = document.querySelector('#uploadForm .close');

    uploadButton.addEventListener('click', () => {
        uploadForm.style.display = 'block';
    });

    closeUploadForm.addEventListener('click', () => {
        uploadForm.style.display = 'none';
    });

    const confirmUploadButton = document.getElementById('confirmUploadButton');
    confirmUploadButton.addEventListener('click', () => {
        const videoUpload = document.getElementById('videoUpload').files[0];
        const videoTitle = document.getElementById('videoTitle').value;
        const videoDescription = document.getElementById('videoDescription').value;

        if (videoUpload && videoTitle) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const newVideo = {
                    title: videoTitle,
                    description: videoDescription,
                    url: e.target.result,
                    views: 0,
                    thumbnail: createThumbnail(videoUpload) // Call to generate thumbnail
                };
                videos.push(newVideo);
                localStorage.setItem('videos', JSON.stringify(videos));
                loadVideos();
                uploadForm.style.display = 'none';
            };
            reader.readAsDataURL(videoUpload);
        }
    });

    const createThumbnail = (file) => {
        return 'default-thumbnail.png'; // Placeholder, should generate a real thumbnail
    };

    loadVideos();
});
