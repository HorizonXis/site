// Cloud Services - Main Script

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initMobileDrawer();
  initConfigurator();
  initFaqAccordion();
  initDeploymentForm();
});

// 1. Smooth Scrolling for In-Page Anchors
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.closeMobileDrawer) window.closeMobileDrawer();
        }
      }
    });
  });
}

// 2. Mobile Drawer Navigation
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const backdrop = document.querySelector('.drawer-backdrop');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  window.closeMobileDrawer = closeDrawer;
}

// 3. Interactive Cloud Configurator (Virtual Machines)
function initConfigurator() {
  const cpuSlider = document.getElementById('cfg-cpu');
  const ramSlider = document.getElementById('cfg-ram');
  const diskSlider = document.getElementById('cfg-disk');
  const deployBtn = document.getElementById('cfg-deploy-btn');

  if (!cpuSlider || !ramSlider || !diskSlider) return;

  const cpuVal = document.getElementById('cfg-cpu-val');
  const ramVal = document.getElementById('cfg-ram-val');
  const diskVal = document.getElementById('cfg-disk-val');
  const priceMo = document.getElementById('cfg-price-mo');
  const priceMoMobile = document.getElementById('cfg-price-mo-mobile');
  const deployBtnMobile = document.getElementById('cfg-deploy-btn-mobile');
  const pillCpu = document.getElementById('pill-cpu');
  const pillRam = document.getElementById('pill-ram');
  const pillDisk = document.getElementById('pill-disk');
  const pillOs = document.getElementById('pill-os');
  const pillIp = document.getElementById('pill-ip');

  let currentOs = 'Ubuntu 24.04 LTS';
  let currentIpType = 'Basic IP';
  let currentIpCost = 150;

  // OS Buttons
  const osButtons = document.querySelectorAll('.os-btn');
  osButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      osButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentOs = btn.getAttribute('data-os') || btn.textContent.trim();
      if (pillOs) pillOs.textContent = currentOs;
      updateConfig();
    });
  });

  // IP Buttons
  const ipButtons = document.querySelectorAll('.ip-btn');
  ipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      ipButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentIpType = btn.getAttribute('data-ip-type') || 'Basic';
      currentIpCost = parseInt(btn.getAttribute('data-ip-cost') || '150', 10);
      if (pillIp) pillIp.textContent = `${currentIpType} IP`;
      updateConfig();
    });
  });

  function calculatePrice(cpu, ram, disk) {
    // Formula: vCPU: ₹90.00/core, RAM: ₹75.00/GB, NVMe: ₹5.00/GB
    return (cpu * 90) + (ram * 75) + (disk * 5);
  }

  function updateConfig() {
    const cpu = parseInt(cpuSlider.value, 10);
    const ram = parseInt(ramSlider.value, 10);
    const disk = parseInt(diskSlider.value, 10);

    if (cpuVal) cpuVal.textContent = `${cpu} vCPU`;
    if (ramVal) ramVal.textContent = `${ram} GB RAM`;
    if (diskVal) diskVal.textContent = `${disk} GB NVMe`;

    if (pillCpu) pillCpu.textContent = `${cpu} vCPU`;
    if (pillRam) pillRam.textContent = `${ram} GB RAM`;
    if (pillDisk) pillDisk.textContent = `${disk} GB NVMe`;
    if (pillIp) pillIp.textContent = `${currentIpType} IP`;

    const monthly = calculatePrice(cpu, ram, disk);

    if (priceMo) priceMo.textContent = `₹${monthly.toLocaleString('en-IN')}`;
    if (priceMoMobile) priceMoMobile.textContent = `₹${monthly.toLocaleString('en-IN')}`;

    const query = new URLSearchParams({
      service: 'Virtual Machine Service',
      cpu: `${cpu} vCPU`,
      ram: `${ram} GB`,
      disk: `${disk} GB NVMe`,
      os: currentOs,
      ip: `${currentIpType} IP (₹${currentIpCost}/mo)`,
      price: `₹${monthly.toLocaleString('en-IN')}/mo`
    });

    if (deployBtn) deployBtn.href = `contact.html?${query.toString()}`;
    if (deployBtnMobile) deployBtnMobile.href = `contact.html?${query.toString()}`;
  }

  cpuSlider.addEventListener('input', updateConfig);
  ramSlider.addEventListener('input', updateConfig);
  diskSlider.addEventListener('input', updateConfig);

  updateConfig();
}

// 4. FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });
}

// 5. Service Request Gateway & Form Handler (contact.html)
function initDeploymentForm() {
  const form = document.querySelector("#deployment-form");
  const copyBtn = document.querySelector("#copy-spec-btn");
  const specBanner = document.querySelector("#selected-spec-box");
  const specDetail = document.querySelector("#selected-spec-detail");

  // Read URL query parameters
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service') || params.get('plan') || '';
  const cpu = params.get('cpu') || '';
  const ram = params.get('ram') || '';
  const disk = params.get('disk') || '';
  const os = params.get('os') || '';
  const price = params.get('price') || '';

  // Auto-populate spec banner if params exist
  if (service || cpu || ram) {
    if (specBanner && specDetail) {
      specBanner.style.display = 'flex';
      const parts = [];
      if (service) parts.push(`Service: ${service}`);
      if (cpu) parts.push(cpu);
      if (ram) parts.push(ram);
      if (disk) parts.push(disk);
      if (os) parts.push(`OS: ${os}`);
      if (price) parts.push(`Estimated: ${price}`);
      specDetail.textContent = parts.join(' | ');
    }

    // Auto-select dropdown
    const serviceSelect = document.querySelector("#service-select");
    if (serviceSelect && service) {
      for (let option of serviceSelect.options) {
        if (option.value.toLowerCase().includes(service.toLowerCase()) || 
            service.toLowerCase().includes(option.value.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }

    // Auto-populate message textarea
    const msgInput = document.querySelector("#requirements");
    if (msgInput && !msgInput.value) {
      msgInput.value = `Selected Service Configuration:\n- Service: ${service}\n- Specs: ${cpu ? cpu + ', ' : ''}${ram ? ram + ', ' : ''}${disk ? disk : ''}\n- OS / Environment: ${os || 'Ubuntu 24.04 LTS'}\n- Datacenter Region: Delhi NCR (NCR1)\n- Notes / Additional requirements: `;
    }
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get("name") || "";
      const email = formData.get("email") || "";
      const org = formData.get("org") || "N/A";
      const selectedService = formData.get("service") || "Cloud Service";
      const region = formData.get("region") || "Delhi NCR (NCR1)";
      const requirements = formData.get("requirements") || "";
      const sshKey = formData.get("ssh_key") || "Not provided";

      const subject = encodeURIComponent(`Cloud Service Request: ${selectedService} - ${name}`);
      const body = encodeURIComponent(
        `SERVICE SPECIFICATION REQUEST\n` +
        `----------------------------------------\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Organization/Project: ${org}\n` +
        `Service: ${selectedService}\n` +
        `Target Region: ${region}\n\n` +
        `Specifications & Workload:\n${requirements}\n\n` +
        `SSH Public Key (if applicable):\n${sshKey}\n` +
        `----------------------------------------\n` +
        `Submitted via Cloud Services Gateway`
      );

      window.location.href = `mailto:horizonxisservice@gmail.com?subject=${subject}&body=${body}`;
      showToast("Launching your email client with service specifications...");
    });
  }

  // Copy Specifications to Clipboard
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const msgInput = document.querySelector("#requirements");
      const textToCopy = msgInput ? msgInput.value : (specDetail ? specDetail.textContent : "Cloud Service Request");
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("✓ Configuration copied to clipboard!");
      }).catch(() => {
        showToast("Please copy the specifications manually from the box.");
      });
    });
  }
}

// 6. Global Toast Notification
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
