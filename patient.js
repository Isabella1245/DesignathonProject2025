// Sidebar toggle and tab switching
(function () {
    const profileBtn = document.getElementById('profileBtn');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('closeBtn');
    const menuItems = document.querySelectorAll('.menu-item');
    const panels = document.querySelectorAll('.tab-panel');

    function openSidebar() {
        sidebar.classList.add('open');
        sidebar.setAttribute('aria-hidden', 'false');
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebar.setAttribute('aria-hidden', 'true');
    }

    profileBtn.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);

    menuItems.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            panels.forEach(p => p.classList.toggle('active', p.id === target));
            // keep sidebar open or close depending on preference:
            // closeSidebar();
        });
    });


    // close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });

    // click outside to close
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !profileBtn.contains(e.target)) {
            closeSidebar();
        }
    });
})();

const editProfileBtn = document.getElementById('editProfile');
const profileBtn = document.getElementById('profileBtn');
const profileTab = document.getElementById("profile");
const allTabs = document.querySelectorAll(".tab-panel");


editProfileBtn.addEventListener('click', () => {
    allTabs.forEach(tab => tab.classList.remove("active"));
    profileTab.classList.add("active");

    const fields = [
        { id: "profileName", type: "text" },
        { id: "profileDOB", type: "date" },
        { id: "profileGender", type: "text" },
        { id: "profileEmail", type: "text" },
        { id: "profilePhoneNum", type: "text" },
        { id: "profileAddress", type: "text" },
        { id: "profileInsurance", type: "text" },
        { id: "profilePharmacy", type: "text" },
        { id: "profilePrimaryClinic", type: "text" }
    ];
    fields.forEach(field => {
        const span = document.getElementById(field.id);
        const value = span.textContent;

        const input = document.createElement("input");
        input.type = field.type;
        input.value = value;
        input.id = field.id; // keep same ID for saving later

        span.replaceWith(input);
    });

    // Optionally, add a Save button
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save Changes";
    saveBtn.addEventListener("click", () => {
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const newValue = input.value || input.defaultValue; // if empty, keep old
            const span = document.createElement("span");
            span.id = field.id;
            span.textContent = newValue;
            input.replaceWith(span);
        });

        saveBtn.remove(); // remove the Save button after saving
    });

    profileTab.appendChild(saveBtn);
});

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("profileUpload");
    const profileBtn = document.getElementById("profileBtn");

    if (fileInput && profileBtn) {
        fileInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    // Remove the existing SVG avatar if present
                    const existingAvatar = profileBtn.querySelector(".avatar");
                    if (existingAvatar) {
                        existingAvatar.remove();
                    }

                    // Create an img element for the uploaded image
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.alt = "Profile picture";
                    img.classList.add("avatar-img"); // style in CSS

                    profileBtn.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("profileUpload");
    const profileBtn = document.getElementById("profileBtn");

    // Helper function to set the avatar image
    function setAvatarImage(imageSrc) {
    // Remove all children (SVG or old img)
    while (profileBtn.firstChild) {
        profileBtn.firstChild.remove();
    }

    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = "Profile picture";
    img.classList.add("avatar-img");

    profileBtn.appendChild(img);
    }


    // Load saved image (if any)
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        setAvatarImage(savedImage);
    }

    // Handle new uploads
    if (fileInput && profileBtn) {
        fileInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageData = e.target.result;

                    // Update the button
                    setAvatarImage(imageData);

                    // Save to localStorage
                    localStorage.setItem("profileImage", imageData);
                };
                reader.readAsDataURL(file);
            }
        });
    }

});

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("profileUpload");
    const profileBtn = document.getElementById("profileBtn");
    const customBtn = document.getElementById("customUploadBtn");
    const fileName = document.getElementById("fileName");

    // Helper function to set the avatar image
    function setAvatarImage(imageSrc) {
        const existingAvatar = profileBtn.querySelector(".avatar, .avatar-img");
        if (existingAvatar) existingAvatar.remove();

        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = "Profile picture";
        img.classList.add("avatar-img");

        profileBtn.appendChild(img);
    }

    // Load saved image
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        setAvatarImage(savedImage);
    }

    // File input change
    if (fileInput) {
        fileInput.addEventListener("change", () => {
            if (fileInput.files.length === 0) return;
            const file = fileInput.files[0];
            if (!file.type.startsWith("image/")) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                setAvatarImage(imageData);
                localStorage.setItem("profileImage", imageData);

                if (fileName) {
                    fileName.textContent = file.name;
                    fileName.hidden = false;
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Custom button triggers file input
    if (customBtn && fileInput) {
        customBtn.addEventListener("click", () => {
            fileInput.click();
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const addProviderBtn = document.getElementById("addProviderBtn");
    const providerList = document.getElementById("providerList");

    // Load saved providers
    let providers = JSON.parse(localStorage.getItem("providers")) || [];

    function renderProviders() {
        providerList.innerHTML = "";
        if (providers.length === 0) {
            providerList.innerHTML = "<li class='empty'>No providers added yet.</li>";
            return;
        }

        providers.forEach((provider, index) => {
            const li = document.createElement("li");
            li.classList.add("provider-item");
            li.innerHTML = `
                <span>${provider}</span>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            providerList.appendChild(li);
        });
    }

    // Add provider
    addProviderBtn.addEventListener("click", () => {
        const name = prompt("Enter provider name:");
        if (name && name.trim() !== "") {
            providers.push(name.trim());
            localStorage.setItem("providers", JSON.stringify(providers));
            renderProviders();
        }
    });

    // Remove provider
    providerList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = e.target.dataset.index;
            providers.splice(index, 1);
            localStorage.setItem("providers", JSON.stringify(providers));
            renderProviders();
        }
    });

    renderProviders();
});
