// SidePanel.js
class SidePanel {
  constructor(container, options = {}) {
    if (!container) {
      console.error("SidePanel container not found!");
      return;
    }
    this.container = container;
    this.options = {
      name: "User Name",
      title: "User Title",
      handle: "userhandle",
      avatarUrl: "",
      logoUrl: "",
      status: "Online",
      watermarkUrls: [],
      ...options
    };
    this.init();
  }

  init() {
    this.createProfileCard();
    this.setupTiltEffect();
  }

  createProfileCard() {
    const { name, title, handle, avatarUrl, logoUrl, status, watermarkUrls } = this.options;
    
    const watermarkImgs = (watermarkUrls.slice(0, 4)).map((url, i) =>
      `<img class="pc-watermark pc-watermark-${i + 1}" src="${url}" alt="" />`
    ).join('');

    const miniAvatarImg = logoUrl ? `<img src="${logoUrl}" alt="Logo">` : '';

    const profileCardHTML = `
      <div class="pc-card pc-card-initial" id="profile-card">
        <div class="pc-inside">
          <div class="pc-avatar-content">
            <img class="avatar" src="${avatarUrl}" alt="Avatar of ${name}">
          </div>
          <div class="pc-content">
            <div class="pc-details">
              <h3>${name}</h3>
              <p>${title}</p>
            </div>
            <div class="pc-user-info">
              <div class="pc-user-details">
                <div class="pc-mini-avatar">
                  ${miniAvatarImg}
                </div>
                <div class="pc-user-text">
                  <div class="pc-handle">@${handle}</div>
                  <div class="pc-status">${status}</div>
                </div>
              </div>
            </div>
          </div>
          ${watermarkImgs}
        </div>
      </div>
    `;
    this.container.innerHTML = profileCardHTML;
    this.card = this.container.querySelector('#profile-card');

    setTimeout(() => {
      if (this.card) {
        this.card.classList.remove('pc-card-initial');
      }
    }, 100);
  }

  setupTiltEffect() {
    if (!this.card) return;

    this.card.addEventListener('mousemove', (e) => {
      const rect = this.card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { width, height } = rect;

      const rotateX = ((x - width / 2) / width) * 20;
      const rotateY = (-(y - height / 2) / height) * 20;

      this.card.style.setProperty('--rotate-x', `${rotateX}deg`);
      this.card.style.setProperty('--rotate-y', `${rotateY}deg`);
      this.card.style.setProperty('--pointer-x', `${(x / width) * 100}%`);
      this.card.style.setProperty('--pointer-y', `${(y / height) * 100}%`);
    });

    this.card.addEventListener('mouseleave', () => {
      this.card.style.setProperty('--rotate-x', '0deg');
      this.card.style.setProperty('--rotate-y', '0deg');
      this.card.style.setProperty('--pointer-x', '50%');
      this.card.style.setProperty('--pointer-y', '50%');
    });
  }
}