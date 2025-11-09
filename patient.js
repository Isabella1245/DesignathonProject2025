document.addEventListener("DOMContentLoaded", () => {

    // =======================
    // Sidebar toggle
    // =======================
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
            closeSidebar();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !profileBtn.contains(e.target)) closeSidebar();
    });

    // =======================
    // Profile persistence
    // =======================
    const profileFields = [
        "profileName",
        "profileDOB",
        "profileGender",
        "profileEmail",
        "profilePhoneNum",
        "profileAddress",
        "profileInsurance",
        "profilePharmacy",
        "profilePrimaryClinic"
    ];

    profileFields.forEach(id => {
        const savedValue = localStorage.getItem(id);
        if (savedValue) {
            const span = document.getElementById(id);
            if (span) span.textContent = savedValue;
            if (id === "profileName") {
                const headerName = document.querySelector('.profile-container h1');
                if (headerName) headerName.textContent = savedValue;
            }
        }
    });

    // =======================
    // Edit Profile
    // =======================
    const editProfileBtn = document.getElementById('editProfile');
    const profileTab = document.getElementById("profile");

    editProfileBtn.addEventListener('click', () => {
        panels.forEach(tab => tab.classList.remove("active"));
        profileTab.classList.add("active");

        const fields = profileFields.map(id => {
            const span = document.getElementById(id);
            return { id, type: (id === "profileDOB" ? "date" : "text"), value: span ? span.textContent : "" };
        });

        fields.forEach(field => {
            const span = document.getElementById(field.id);
            const input = document.createElement("input");
            input.type = field.type;
            input.value = field.value;
            input.id = field.id;
            if (span) span.replaceWith(input);
        });

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save Changes";
        saveBtn.addEventListener("click", () => {
            fields.forEach(field => {
                const input = document.getElementById(field.id);
                const newValue = input.value || input.textContent;
                const span = document.createElement("span");
                span.id = field.id;
                span.textContent = newValue;
                input.replaceWith(span);

                if (field.id === "profileName") {
                    const headerName = document.querySelector('.profile-container h1');
                    if (headerName) headerName.textContent = newValue;
                }

                localStorage.setItem(field.id, newValue);
            });

            saveBtn.remove();
        });

        profileTab.appendChild(saveBtn);
    });

    // =======================
    // Profile picture
    // =======================
    const fileInput = document.getElementById("profileUpload");
    const customBtn = document.getElementById("customUploadBtn");
    const fileName = document.getElementById("fileName");

    function setAvatarImage(imageSrc) {
        const existingAvatar = profileBtn.querySelector(".avatar, .avatar-img");
        if (existingAvatar) existingAvatar.remove();
        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = "Profile picture";
        img.classList.add("avatar-img");
        profileBtn.appendChild(img);
    }

    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setAvatarImage(savedImage);

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

    if (customBtn && fileInput) {
        customBtn.addEventListener("click", () => fileInput.click());
    }

    // =======================
    // Providers & summaries
    // =======================
    const addProviderBtn = document.getElementById("addProviderBtn");
    const providerList = document.getElementById("providerList");
    const providerTabs = document.getElementById("providerTabs");
    const summaryContent = document.getElementById("summaryContent");

    const providerPrompt = document.getElementById("providerPrompt");
    const providerInput = document.getElementById("providerInput");
    const providerOk = document.getElementById("providerOk");
    const providerCancel = document.getElementById("providerCancel");

    let providers = JSON.parse(localStorage.getItem("providers")) || [];
    let activeProvider = null;

    function renderProviders() {
        providerList.innerHTML = "";
        if (providers.length === 0) {
            providerList.innerHTML = "<li class='empty'>No providers added yet.</li>";
            providerTabs.innerHTML = "";
            summaryContent.innerHTML = "<p class='empty'>No providers added yet. Add providers in the 'My Providers' tab.</p>";
            return;
        }

        providers.forEach((provider, index) => {
            const li = document.createElement("li");
            li.classList.add("provider-item");
            li.innerHTML = `<span>${provider}</span>
                            <button class="remove-btn" data-index="${index}">Remove</button>`;
            providerList.appendChild(li);
        });

        renderProviderTabs();
    }

    function renderProviderTabs() {
        providerTabs.innerHTML = "";

        providers.forEach((provider, index) => {
            const button = document.createElement("button");
            button.classList.add("provider-tab");
            button.textContent = provider;
            button.dataset.provider = provider;

            if (index === 0 && !activeProvider) {
                button.classList.add("active");
                activeProvider = provider;
                showSummary(provider);
            } else if (activeProvider === provider) {
                button.classList.add("active");
            }

            button.addEventListener("click", () => {
                document.querySelectorAll(".provider-tab").forEach(tab => tab.classList.remove("active"));
                button.classList.add("active");
                activeProvider = provider;
                showSummary(provider);
            });

            providerTabs.appendChild(button);
        });
    }

    function showSummary(providerName) {
        const summaries = JSON.parse(localStorage.getItem("providerSummaries")) || {};
        const summary = summaries[providerName] || "No summary available yet.";
        summaryContent.innerHTML = `<div class="summary-card">
                                        <h3>${providerName}</h3>
                                        <p>${summary}</p>
                                    </div>`;
    }

    function openProviderPrompt() {
        providerInput.value = "";
        providerPrompt.classList.remove("hidden");
        providerInput.focus();
    }
    function closeProviderPrompt() {
        providerPrompt.classList.add("hidden");
    }

    providerOk.addEventListener("click", () => {
        const name = providerInput.value.trim();
        if (name) {
            providers.push(name);
            localStorage.setItem("providers", JSON.stringify(providers));
            renderProviders();
        }
        closeProviderPrompt();
    });

    providerCancel.addEventListener("click", closeProviderPrompt);

    providerInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") providerOk.click();
        if (e.key === "Escape") closeProviderPrompt();
    });

    addProviderBtn.addEventListener("click", openProviderPrompt);

    providerList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = e.target.dataset.index;
            const removedProvider = providers[index];
            providers.splice(index, 1);
            localStorage.setItem("providers", JSON.stringify(providers));

            const summaries = JSON.parse(localStorage.getItem("providerSummaries")) || {};
            delete summaries[removedProvider];
            localStorage.setItem("providerSummaries", JSON.stringify(summaries));

            if (activeProvider === removedProvider) activeProvider = null;
            renderProviders();
        }
    });

    renderProviders();
});
