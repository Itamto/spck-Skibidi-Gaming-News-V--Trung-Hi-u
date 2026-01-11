/**
 * HÀM HIỂN THỊ DANH SÁCH BÀI ĐĂNG (Dùng ở trang index.html)
 */
function displayPosts() {
    // 1. Tìm cái "giỏ" chứa bài đăng trên giao diện
    const container = document.getElementById('dynamic-posts');
    if (!container) return; // Nếu không thấy thì thôi, không chạy nữa

    // 2. Lấy dữ liệu từ bộ nhớ trình duyệt (LocalStorage). Nếu chưa có thì mặc định là mảng rỗng []
    const posts = JSON.parse(localStorage.getItem('hyper_posts')) || [];
    
    // 3. Nếu không có bài nào thì hiện thông báo "Chưa có bài đăng"
    if (posts.length === 0) {
        container.innerHTML = '<p class="text-white px-4 italic opacity-70">Chưa có bài đăng nào từ cộng đồng...</p>';
        return;
    }

    // 4. Xóa sạch nội dung cũ trong giỏ trước khi đổ dữ liệu mới vào
    container.innerHTML = '';

    // 5. Duyệt qua từng bài đăng và vẽ (render) nó ra HTML
    posts.forEach((post) => {
        container.innerHTML += `
            <div class="card rounded-lg shadow-lg overflow-hidden h-full transition-transform hover:scale-[1.02] relative">
                <button onclick="deletePost('${post.id}')" class="absolute top-2 right-2 bg-red-500 text-white p-1 px-2 rounded-full text-xs hover:bg-red-700 z-10">Xóa</button>
                
                <img src="${post.image}" class="w-full h-48 object-contain" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Loi+Anh'">
                
                <div class="p-4 text-center">
                    <h3 class="text-xl font-bold text-black line-clamp-2">${post.title}</h3>
                    <p class="text-gray-700 text-sm mt-2 line-clamp-2">${post.description}</p>
                    <button onclick="window.location.href='post.html?id=${post.id}'" 
                            class="bg-blue-400 hover:bg-blue-500 text-white w-full py-2 rounded-lg mt-4 transition">
                        Xem chi tiết
                    </button>
                </div>
            </div>`;
    });
}

/**
 * HÀM XỬ LÝ XÓA BÀI ĐĂNG
 */
function deletePost(id) {
    // Hiện bảng hỏi xác nhận cho chắc ăn
    if (confirm("Hiếu có chắc chắn muốn xóa bài này không?")) {
        // Lấy danh sách bài hiện tại ra
        let posts = JSON.parse(localStorage.getItem('hyper_posts')) || [];
        
        // Lọc: Chỉ giữ lại những bài nào có ID KHÁC với cái ID mình muốn xóa
        posts = posts.filter(post => post.id !== id);
        
        // Lưu lại danh sách mới (đã mất bài vừa xóa) vào lại kho LocalStorage
        localStorage.setItem('hyper_posts', JSON.stringify(posts));
        
        // Gọi lại hàm hiển thị để giao diện cập nhật ngay lập tức
        displayPosts();
    }
}

/**
 * HÀM XỬ LÝ KHI BẤM NÚT ĐĂNG BÀI (Dùng ở trang create.html)
 */
function handleCreatePost(event) {
    event.preventDefault(); // Ngăn trang web bị tải lại khi bấm submit form

    // Lấy giá trị từ các ô nhập liệu
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;

    // Tạo một đối tượng bài đăng mới
    const newPost = {
        id: Date.now().toString(), // Dùng thời gian hiện tại làm ID (đảm bảo không bao giờ trùng)
        title: title,
        description: description,
        image: image,
        date: new Date().toLocaleDateString('vi-VN') // Lấy ngày tháng năm hiện tại kiểu Việt Nam
    };

    // Lấy danh sách cũ ra, thêm bài mới vào đầu mảng (unshift)
    const posts = JSON.parse(localStorage.getItem('hyper_posts')) || [];
    posts.unshift(newPost);
    
    // Cất vào kho
    localStorage.setItem('hyper_posts', JSON.stringify(posts));

    alert("Đăng bài thành công!");
    window.location.href = 'index.html'; // Đăng xong thì đẩy người dùng về trang chủ
}

/**
 * HÀM HIỂN THỊ CHI TIẾT 1 BÀI ĐĂNG (Dùng ở trang post.html)
 */
function displaySinglePost() {
    const container = document.getElementById('postContainer');
    if (!container) return;

    // 1. Lấy cái ID từ trên thanh địa chỉ xuống (ví dụ: post.html?id=12345)
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // 2. Tìm bài đăng khớp với cái ID đó trong kho dữ liệu
    const posts = JSON.parse(localStorage.getItem('hyper_posts')) || [];
    const post = posts.find(p => p.id === postId);

    // 3. Nếu tìm thấy thì đổ dữ liệu ra trang post.html
    if (post) {
        container.innerHTML = `
            <img src="${post.image}" class="w-full h-96 object-contain" />
            <div class="p-8 text-left text-black">
                <h1 class="text-3xl font-extrabold mb-4">${post.title}</h1>
                <p class="text-blue-500 mb-6 italic">Ngày đăng: ${post.date}</p>
                <div class="text-gray-700 text-lg leading-relaxed whitespace-pre-line">${post.description}</div>
            </div>`;
    }
}

/**
 * ĐOẠN MÃ KÍCH HOẠT KHI TRANG WEB TẢI XONG
 */
document.addEventListener('DOMContentLoaded', () => {
    displayPosts();       // Thử chạy hàm hiện danh sách
    displaySinglePost();  // Thử chạy hàm hiện bài chi tiết
    
    // Nếu trang này có cái form tạo bài thì mới gán sự kiện "Lắng nghe nút bấm Đăng bài"
    const form = document.getElementById('createPostForm');
    if (form) form.addEventListener('submit', handleCreatePost);
});