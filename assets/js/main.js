/* Lil's haarsalon — interactie
   1. Live statuslamp (groen/oranje/rood) op basis van de openingstijden
   2. Navigatie op mobiel
   3. Vandaag-markering in de openingstijdentabel
   4. Afspraakformulier
   5. Scroll-reveal: blokken komen zachtjes omhoog als ze in beeld komen

   Dit is een klassiek script en geen ES-module, zodat de site ook werkt
   als je index.html opent vanaf je schijf (file://). Daar blokkeert de
   browser modules vanwege CORS.
*/

(() => {
  "use strict";

  /* Openingstijden: 0 = zondag ... 6 = zaterdag.
     Bron: openingstijden.nl en beautynailhairsalons.com, geraadpleegd 30 oktober 2026. */
  const HOURS = [
    { day: 0, open: null, close: null },            // zondag: gesloten
    { day: 1, open: "09:00", close: "17:30" },      // maandag
    { day: 2, open: "09:00", close: "17:30" },      // dinsdag
    { day: 3, open: null, close: null },            // woensdag: gesloten
    { day: 4, open: "09:00", close: "17:30" },      // donderdag
    { day: 5, open: "09:00", close: "17:30" },      // vrijdag
    { day: 6, open: "08:30", close: "15:00" }       // zaterdag
  ];

  const DAY_NAMES = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
  const CLOSING_SOON_MINUTES = 60;

  const toMinutes = (value) => {
    const parts = value.split(":");
    return Number.parseInt(parts[0], 10) * 60 + Number.parseInt(parts[1], 10);
  };

  const formatTime = (value) => value.replace(":", ".");

  /* De eerstvolgende dag waarop de salon opengaat. Begin altijd bij morgen:
     vandaag is er al voorbij, of de salon staat vandaag helemaal dicht. */
  const nextOpening = (now) => {
    for (let i = 1; i <= 7; i += 1) {
      const index = (now.getDay() + i) % 7;
      const day = HOURS[index];
      if (day.open) {
        return { time: day.open, dayName: DAY_NAMES[index] };
      }
    }
    return { time: "09:00", dayName: "morgen" };
  };

  const currentStatus = (now) => {
    const today = HOURS[now.getDay()];
    const minutes = now.getHours() * 60 + now.getMinutes();

    if (!today.open) {
      const next = nextOpening(now);
      return { state: "closed", label: `Gesloten, opent ${next.dayName} om ${formatTime(next.time)}` };
    }

    const opens = toMinutes(today.open);
    const closes = toMinutes(today.close);

    if (minutes < opens) {
      return { state: "closed", label: `Gesloten, opent om ${formatTime(today.open)}` };
    }
    if (minutes >= closes) {
      const next = nextOpening(now);
      return { state: "closed", label: `Gesloten, opent ${next.dayName} om ${formatTime(next.time)}` };
    }
    if (closes - minutes <= CLOSING_SOON_MINUTES) {
      return { state: "closing", label: `Nog open tot ${formatTime(today.close)}` };
    }
    return { state: "open", label: `Nu geopend tot ${formatTime(today.close)}` };
  };

  /* ---- 1. Statuslamp --------------------------------------------------- */

  const renderStatus = () => {
    const status = currentStatus(new Date());
    const lamps = document.querySelectorAll("[data-status-lamp]");
    lamps.forEach((lamp) => {
      lamp.setAttribute("data-state", status.state);
      const text = lamp.querySelector("[data-status-text]");
      if (text) text.textContent = status.label;
    });
  };

  /* ---- 2. Mobiele navigatie --------------------------------------------- */

  const initNav = () => {
    const toggle = document.querySelector("[data-nav-toggle]");
    const dialog = document.querySelector("[data-mobile-nav]");
    if (!toggle || !dialog) return;

    const closeButton = dialog.querySelector("[data-nav-close]");

    const open = () => {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
      document.body.style.overflow = "";
      toggle.focus();
    };

    toggle.addEventListener("click", open);
    if (closeButton) closeButton.addEventListener("click", close);

    /* Een link kiezen sluit het menu. */
    dialog.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });

    /* Klikken op de achtergrond sluit het menu. */
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) close();
    });
  };

  /* ---- 3. Vandaag in de openingstijdentabel ---------------------------- */

  const markToday = () => {
    const today = new Date().getDay();
    const rows = document.querySelectorAll("[data-hours-row]");
    rows.forEach((row) => {
      if (Number.parseInt(row.getAttribute("data-hours-row"), 10) === today) {
        row.setAttribute("data-today", "true");
      }
    });
  };

  /* ---- 4. Afspraakformulier --------------------------------------------- */

  const initForm = () => {
    const form = document.querySelector("[data-appointment-form]");
    if (!form) return;

    const status = form.querySelector("[data-form-status]");
    const copyButton = form.querySelector("[data-form-copy]");

    const setError = (field, message) => {
      const wrapper = field.closest(".field");
      const error = wrapper ? wrapper.querySelector("[data-field-error]") : null;
      if (wrapper) wrapper.setAttribute("data-invalid", message ? "true" : "false");
      if (error) error.textContent = message || "";
      field.setAttribute("aria-invalid", message ? "true" : "false");
    };

    const validate = () => {
      let ok = true;
      const name = form.elements.name;
      const phone = form.elements.phone;
      const email = form.elements.email;
      const service = form.elements.service;
      const message = form.elements.message;

      [name, phone, email, service, message].forEach((field) => {
        if (field) setError(field, "");
      });

      if (!name.value.trim()) {
        setError(name, "Vul je naam in.");
        ok = false;
      }

      const phoneValue = phone.value.replace(/[^0-9]/g, "");
      if (!phoneValue) {
        setError(phone, "Vul een telefoonnummer in zodat we je kunnen terugbellen.");
        ok = false;
      } else if (phoneValue.length < 9) {
        setError(phone, "Dit nummer lijkt te kort. Controleer het even.");
        ok = false;
      }

      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        setError(email, "Dit e-mailadres mist een @ of een punt.");
        ok = false;
      }

      if (!service.value) {
        setError(service, "Kies waarvoor je komt.");
        ok = false;
      }

      if (!message.value.trim()) {
        setError(message, "Vertel kort wat je wilt, dan weten wij wat we inplannen.");
        ok = false;
      }

      return ok;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validate()) {
        status.setAttribute("data-state", "error");
        status.textContent = "Nog niet verzonden: controleer de gemarkeerde velden.";
        const firstInvalid = form.querySelector("[data-invalid='true'] input, [data-invalid='true'] textarea, [data-invalid='true'] select");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const name = form.elements.name.value.trim();
      const phone = form.elements.phone.value.trim();
      const email = form.elements.email.value.trim();
      const service = form.elements.service.value;
      const when = form.elements.moment.value.trim();
      const message = form.elements.message.value.trim();

      const summary =
        "Afspraakverzoek via de website van Lil's haarsalon\n\n" +
        `Naam: ${name}\n` +
        `Telefoon: ${phone}\n` +
        (email ? `E-mail: ${email}\n` : "") +
        `Behandeling: ${service}\n` +
        (when ? `Voorkeur: ${when}\n` : "") +
        `\n${message}\n`;

      const paragraph = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = "Je gegevens staan klaar.";
      const phoneLink = document.createElement("a");
      phoneLink.href = "tel:+31181219017";
      phoneLink.textContent = "0181-219017";
      paragraph.append(strong, " Bel ", phoneLink,
        " om de afspraak definitief te maken, of stuur het bericht via Instagram. " +
        "Je vindt de gegevens ook hieronder, kopieer ze gerust.");

      status.setAttribute("data-state", "ok");
      status.replaceChildren(paragraph);

      if (copyButton) {
        copyButton.hidden = false;
        copyButton.focus();
      }

      const output = form.querySelector("[data-form-summary]");
      if (output) output.textContent = summary;
    });

    if (copyButton) {
      copyButton.addEventListener("click", () => {
        const output = form.querySelector("[data-form-summary]");
        if (!output) return;
        const text = output.textContent || "";
        const done = () => {
          copyButton.textContent = "Gekopieerd";
          window.setTimeout(() => {
            copyButton.textContent = "Kopieer je gegevens";
          }, 2400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, () => {});
        } else {
          const area = document.createElement("textarea");
          area.value = text;
          document.body.append(area);
          area.select();
          try {
            document.execCommand("copy");
            done();
          } catch (error) {
            /* Klembord niet beschikbaar: de tekst staat toch op de pagina. */
          }
          document.body.removeChild(area);
        }
      });
    }
  };

  /* ---- 5. Scroll-reveal -------------------------------------------------- */

  const initReveal = () => {
    /* De vangnettimer uit de <head> is niet meer nodig. */
    if (window.lilsRevealFailsafe) {
      window.clearTimeout(window.lilsRevealFailsafe);
      window.lilsRevealFailsafe = null;
    }

    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(document.querySelectorAll("[data-reveal]"));
    if (items.length === 0) return;

    /* Binnen één sectie komt elk blok iets later dan het vorige. */
    let section = null;
    let index = 0;
    items.forEach((item) => {
      const current = item.closest("section") || document.body;
      if (current !== section) {
        section = current;
        index = 0;
      }
      item.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 60}ms`);
      index += 1;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    items.forEach((item) => observer.observe(item));
  };

  /* ---- Start ------------------------------------------------------------ */

  const init = () => {
    renderStatus();
    initNav();
    markToday();
    initForm();
    initReveal();
    /* Herhaal de lampstatus elk half uur, zodat de status klopt na sluitingstijd. */
    window.setInterval(renderStatus, 30 * 60 * 1000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
