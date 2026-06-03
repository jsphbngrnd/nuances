const STORAGE_KEY = "studio-os-v1";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

const defaultData = {
  settings: {
    studioName: "Benjamin Caron Studio",
    hourlyRate: 85,
    defaultVatRate: 20,
    annualGoal: 120000,
  },
  prospects: [
    {
      id: createId(),
      company: "Hazzan & Bouchareu",
      name: "Julie Bouchareu",
      role: "Avocate associée",
      email: "julie@h-b-avocats.fr",
      city: "Marseille",
      segment: "Cabinet d'avocats",
      source: "Réseau / projet entrant",
      status: "Proposition envoyée",
      notes: "Projet de refonte site + alignement Entourage.",
      createdAt: today(),
    },
    {
      id: createId(),
      company: "Laude & Associés",
      name: "Amélie Matela",
      role: "Cheffe de projet",
      email: "amelie@bl-nk.fr",
      city: "Paris",
      segment: "Cabinet d'avocats",
      source: "BLNK",
      status: "En échange",
      notes: "Retours identité, besoin de variantes logo et directives photo.",
      createdAt: today(),
    },
  ],
  campaigns: [
    {
      id: createId(),
      name: "Cabinets premium Marseille",
      segment: "Cabinet d'avocats",
      subject: "Refonte de site et repositionnement éditorial",
      message: "Approche site, marque et SEO pensée pour cabinets d'avocats à forte exigence d'image.",
      createdAt: today(),
    },
  ],
  clients: [
    {
      id: createId(),
      name: "Hazzan & Bouchareu",
      contact: "Julie Bouchareu",
      email: "julie@h-b-avocats.fr",
      phone: "04 91 22 02 28",
      type: "Cabinet",
      city: "Marseille",
      notes: "Refonte du site, logique Entourage, DA premium contemporaine.",
    },
    {
      id: createId(),
      name: "Atlantes",
      contact: "Evelyn Bledniak",
      email: "evelyn.bledniak@atlantes.fr",
      phone: "01 56 53 65 00",
      type: "Cabinet",
      city: "Paris",
      notes: "Maquette PLUME et suivis d'impression.",
    },
  ],
  projects: [],
  documents: [],
  timeEntries: [],
  expenses: [
    {
      id: createId(),
      label: "Abonnement Adobe",
      category: "Logiciels",
      date: today(),
      amount: 72,
    },
  ],
  finance: [],
};

function buildInitialProjectsAndFinance(data) {
  if (data.projects.length || data.finance.length || data.timeEntries.length) {
    return data;
  }

  const hazzan = data.clients.find((client) => client.name === "Hazzan & Bouchareu");
  const atlantes = data.clients.find((client) => client.name === "Atlantes");

  const project1 = {
    id: createId(),
    name: "Refonte du site H&B",
    clientId: hazzan?.id || "",
    type: "Site web",
    status: "En cours",
    deadline: shiftDate(20),
    budget: 9500,
    nextAction: "Finaliser l'architecture V1 et maquetter la home.",
    notes: "Projet structurant avec narration, SEO et cohérence de marque.",
  };

  const project2 = {
    id: createId(),
    name: "PLUME Mars 2026",
    clientId: atlantes?.id || "",
    type: "Édition",
    status: "Livré",
    deadline: shiftDate(-10),
    budget: 1800,
    nextAction: "Envoyer facture et archiver les sources.",
    notes: "Réalisation revue print avec allers-retours et version imprimeur.",
  };

  data.projects.push(project1, project2);

  data.timeEntries.push(
    {
      id: createId(),
      projectId: project1.id,
      date: today(),
      category: "Stratégie",
      hours: 6,
      note: "Architecture éditoriale, hubs, logique CRM + finance.",
    },
    {
      id: createId(),
      projectId: project1.id,
      date: today(),
      category: "DA",
      hours: 3.5,
      note: "Intentions de marque et système de mouvement.",
    },
    {
      id: createId(),
      projectId: project2.id,
      date: shiftDate(-7),
      category: "Design",
      hours: 4,
      note: "Corrections PLUME et mise en page finale.",
    }
  );

  data.finance.push(
    {
      id: createId(),
      kind: "quote",
      reference: "DEVIS-2026-AA13",
      clientId: hazzan?.id || "",
      projectId: project1.id,
      date: shiftDate(-30),
      dueDate: shiftDate(-15),
      amountHt: 2000,
      vatRate: 20,
      status: "Validé",
      paidAmount: 0,
      label: "Recommandation stratégique & architecture",
    },
    {
      id: createId(),
      kind: "invoice",
      reference: "Facture-2026-AA10",
      clientId: atlantes?.id || "",
      projectId: project2.id,
      date: shiftDate(-5),
      dueDate: shiftDate(25),
      amountHt: 1800,
      vatRate: 20,
      status: "Envoyé",
      paidAmount: 0,
      label: "LA PLUME mars 2026",
    },
    {
      id: createId(),
      kind: "invoice",
      reference: "Facture-2026-AA11",
      clientId: hazzan?.id || "",
      projectId: project1.id,
      date: today(),
      dueDate: shiftDate(30),
      amountHt: 2500,
      vatRate: 20,
      status: "Envoyé",
      paidAmount: 1000,
      label: "Direction artistique & identité",
    }
  );

  return data;
}

let state = buildInitialProjectsAndFinance(loadState());

const ui = {
  viewTitle: document.querySelector("#view-title"),
  navLinks: document.querySelectorAll(".nav-link"),
  views: document.querySelectorAll(".view"),
  metricTemplate: document.querySelector("#metric-template"),
  quickStats: document.querySelector("#quick-stats"),
  dashboardMetrics: document.querySelector("#dashboard-metrics"),
  dashboardActions: document.querySelector("#dashboard-actions"),
  dashboardPipeline: document.querySelector("#dashboard-pipeline"),
  dashboardRevenue: document.querySelector("#dashboard-revenue"),
  dashboardTime: document.querySelector("#dashboard-time"),
  prospectList: document.querySelector("#prospect-list"),
  campaignList: document.querySelector("#campaign-list"),
  clientList: document.querySelector("#client-list"),
  projectList: document.querySelector("#project-list"),
  financeList: document.querySelector("#finance-list"),
  expenseList: document.querySelector("#expense-list"),
  financeSummary: document.querySelector("#finance-summary"),
  timeList: document.querySelector("#time-list"),
  settingsPreview: document.querySelector("#settings-preview"),
};

bindNavigation();
bindForms();
bindActions();
render();

function bindNavigation() {
  ui.navLinks.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      ui.navLinks.forEach((item) => item.classList.toggle("is-active", item === button));
      ui.views.forEach((panel) =>
        panel.classList.toggle("is-visible", panel.id === `${view}-view`)
      );
      ui.viewTitle.textContent = button.textContent;
    });
  });
}

function bindForms() {
  document.querySelector("#prospect-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.prospects.unshift({
      id: createId(),
      company: formData.get("company"),
      name: formData.get("name"),
      role: formData.get("role"),
      email: formData.get("email"),
      city: formData.get("city"),
      segment: formData.get("segment"),
      source: formData.get("source"),
      status: formData.get("status"),
      notes: formData.get("notes"),
      createdAt: today(),
    });
    event.currentTarget.reset();
    persistAndRender();
  });

  document.querySelector("#campaign-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.campaigns.unshift({
      id: createId(),
      name: formData.get("name"),
      segment: formData.get("segment"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      createdAt: today(),
    });
    event.currentTarget.reset();
    persistAndRender();
  });

  document.querySelector("#client-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.clients.unshift({
      id: createId(),
      name: formData.get("name"),
      contact: formData.get("contact"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      type: formData.get("type"),
      city: formData.get("city"),
      notes: formData.get("notes"),
    });
    event.currentTarget.reset();
    persistAndRender();
  });

  document.querySelector("#project-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.projects.unshift({
      id: createId(),
      name: formData.get("name"),
      clientId: formData.get("clientId"),
      type: formData.get("type"),
      status: formData.get("status"),
      deadline: formData.get("deadline"),
      budget: Number(formData.get("budget") || 0),
      nextAction: formData.get("nextAction"),
      notes: formData.get("notes"),
    });
    event.currentTarget.reset();
    persistAndRender();
  });

  document.querySelector("#invoice-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.finance.unshift({
      id: createId(),
      kind: formData.get("kind"),
      reference: formData.get("reference"),
      clientId: formData.get("clientId"),
      projectId: formData.get("projectId"),
      date: formData.get("date"),
      dueDate: formData.get("dueDate"),
      amountHt: Number(formData.get("amountHt") || 0),
      vatRate: Number(formData.get("vatRate") || 0),
      status: formData.get("status"),
      paidAmount: Number(formData.get("paidAmount") || 0),
      label: formData.get("label"),
    });
    event.currentTarget.reset();
    persistAndRender();
  });

  document.querySelector("#expense-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.expenses.unshift({
      id: createId(),
      label: formData.get("label"),
      category: formData.get("category"),
      date: formData.get("date"),
      amount: Number(formData.get("amount") || 0),
    });
    event.currentTarget.reset();
    persistAndRender();
  });

  document.querySelector("#time-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.timeEntries.unshift({
      id: createId(),
      projectId: formData.get("projectId"),
      date: formData.get("date"),
      category: formData.get("category"),
      hours: Number(formData.get("hours") || 0),
      note: formData.get("note"),
    });
    event.currentTarget.reset();
    persistAndRender();
  });

  document.querySelector("#settings-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.settings = {
      studioName: formData.get("studioName"),
      hourlyRate: Number(formData.get("hourlyRate") || 0),
      defaultVatRate: Number(formData.get("defaultVatRate") || 0),
      annualGoal: Number(formData.get("annualGoal") || 0),
    };
    persistAndRender();
  });
}

function bindActions() {
  document.querySelector("#seed-demo").addEventListener("click", () => {
    state = buildInitialProjectsAndFinance(cloneData(defaultData));
    persistAndRender();
  });

  document.querySelector("#export-data").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `studio-os-export-${today()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });
}

function render() {
  hydrateSelects();
  hydrateSettings();
  renderQuickStats();
  renderDashboard();
  renderProspects();
  renderCampaigns();
  renderClients();
  renderProjects();
  renderFinance();
  renderExpenses();
  renderTimeEntries();
  ui.settingsPreview.textContent = JSON.stringify(state, null, 2);
}

function hydrateSelects() {
  const clientOptions = state.clients
    .map((client) => `<option value="${client.id}">${escapeHtml(client.name)}</option>`)
    .join("");
  document.querySelector("#project-client-select").innerHTML = clientOptions;
  document.querySelector("#finance-client-select").innerHTML = clientOptions;

  const projectOptions = state.projects
    .map((project) => `<option value="${project.id}">${escapeHtml(project.name)}</option>`)
    .join("");
  document.querySelector("#finance-project-select").innerHTML =
    `<option value="">Aucun</option>${projectOptions}`;
  document.querySelector("#time-project-select").innerHTML = projectOptions;
}

function hydrateSettings() {
  const form = document.querySelector("#settings-form");
  form.elements.studioName.value = state.settings.studioName;
  form.elements.hourlyRate.value = state.settings.hourlyRate;
  form.elements.defaultVatRate.value = state.settings.defaultVatRate;
  form.elements.annualGoal.value = state.settings.annualGoal;
}

function renderQuickStats() {
  const metrics = computeMetrics();
  const items = [
    ["Prospects actifs", metrics.activeProspects],
    ["Clients", state.clients.length],
    ["Projets en cours", metrics.activeProjects],
    ["À encaisser", formatCurrency(metrics.outstanding)],
  ];
  ui.quickStats.innerHTML = items
    .map(
      ([label, value]) => `
        <div class="quick-stat">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `
    )
    .join("");
}

function renderDashboard() {
  const metrics = computeMetrics();
  const cards = [
    ["CA encaissé ce mois", formatCurrency(metrics.monthlyRevenue), "factures réglées sur le mois"],
    ["CA annuel encaissé", formatCurrency(metrics.annualRevenue), `${Math.round(metrics.goalProgress)}% de l'objectif`],
    ["Reste à encaisser", formatCurrency(metrics.outstanding), `${metrics.overdueCount} document(s) à surveiller`],
    ["TVA à provisionner", formatCurrency(metrics.vatDue), "sur les factures émises"],
    ["Charges du mois", formatCurrency(metrics.monthlyExpenses), "hors taxes non détaillées"],
    ["Temps saisi ce mois", `${metrics.monthlyHours.toFixed(1)} h`, "toutes catégories confondues"],
    ["Taux de charge moyen", `${formatCurrency(metrics.averageHourlyValue)}/h`, "basé sur les projets facturés"],
    ["Deadlines proches", `${metrics.upcomingDeadlines.length}`, "dans les 14 prochains jours"],
  ];

  ui.dashboardMetrics.innerHTML = "";
  cards.forEach(([label, value, meta]) => {
    const node = ui.metricTemplate.content.cloneNode(true);
    node.querySelector(".metric-label").textContent = label;
    node.querySelector(".metric-value").textContent = value;
    node.querySelector(".metric-meta").textContent = meta;
    ui.dashboardMetrics.appendChild(node);
  });

  ui.dashboardActions.innerHTML = metrics.upcomingDeadlines.length
    ? metrics.upcomingDeadlines
        .map(
          (project) => `
            <div class="list-item">
              <h4>${escapeHtml(project.name)}</h4>
              <p class="subtle">${clientName(project.clientId)} · Deadline ${formatDate(project.deadline)}</p>
              <p>${escapeHtml(project.nextAction || "Pas de prochaine action renseignée.")}</p>
            </div>
          `
        )
        .join("")
    : `<div class="list-item"><h4>Aucune urgence immédiate</h4><p class="subtle">Les projets des 14 prochains jours sont sous contrôle.</p></div>`;

  ui.dashboardPipeline.innerHTML = renderPipelineColumns();
  ui.dashboardRevenue.innerHTML = renderRevenueBars();
  ui.dashboardTime.innerHTML = renderTimeByProject();
}

function renderProspects() {
  ui.prospectList.innerHTML = state.prospects
    .map(
      (prospect) => `
        <article class="card-item">
          <h4>${escapeHtml(prospect.company)}</h4>
          <p class="list-meta">${escapeHtml(prospect.name)} · ${escapeHtml(prospect.role || "Contact")}</p>
          <div class="tag-row">
            <span class="tag">${escapeHtml(prospect.segment)}</span>
            <span class="tag tag-warm">${escapeHtml(prospect.status)}</span>
          </div>
          <p>${escapeHtml(prospect.notes || "Pas de note.")}</p>
          <p class="subtle">${escapeHtml(prospect.city || "Ville non renseignée")} · Source : ${escapeHtml(prospect.source || "Non renseignée")}</p>
        </article>
      `
    )
    .join("");
}

function renderCampaigns() {
  ui.campaignList.innerHTML = state.campaigns
    .map(
      (campaign) => `
        <article class="card-item">
          <h4>${escapeHtml(campaign.name)}</h4>
          <p class="list-meta">${escapeHtml(campaign.segment)} · ${formatDate(campaign.createdAt)}</p>
          <p><strong>Objet :</strong> ${escapeHtml(campaign.subject)}</p>
          <p>${escapeHtml(campaign.message || "Aucun message renseigné.")}</p>
        </article>
      `
    )
    .join("");
}

function renderClients() {
  ui.clientList.innerHTML = state.clients
    .map((client) => {
      const relatedProjects = state.projects.filter((project) => project.clientId === client.id).length;
      const revenue = state.finance
        .filter((item) => item.clientId === client.id && item.kind === "invoice")
        .reduce((sum, item) => sum + item.paidAmount, 0);
      return `
        <article class="card-item">
          <h4>${escapeHtml(client.name)}</h4>
          <p class="list-meta">${escapeHtml(client.contact || "Pas de contact")} · ${escapeHtml(client.city || "Ville non renseignée")}</p>
          <div class="tag-row">
            <span class="tag">${escapeHtml(client.type)}</span>
            <span class="tag tag-warm">${relatedProjects} projet(s)</span>
            <span class="tag">${formatCurrency(revenue)} encaissés</span>
          </div>
          <p>${escapeHtml(client.notes || "Aucune note.")}</p>
        </article>
      `;
    })
    .join("");
}

function renderProjects() {
  ui.projectList.innerHTML = state.projects
    .map((project) => {
      const hours = sumHours(project.id);
      const estimatedValue = hours * state.settings.hourlyRate;
      return `
        <article class="card-item">
          <h4>${escapeHtml(project.name)}</h4>
          <p class="list-meta">${clientName(project.clientId)} · ${escapeHtml(project.type)}</p>
          <div class="tag-row">
            <span class="tag">${escapeHtml(project.status)}</span>
            <span class="tag tag-warm">Deadline ${project.deadline ? formatDate(project.deadline) : "—"}</span>
            <span class="tag">${hours.toFixed(1)} h</span>
          </div>
          <p>${escapeHtml(project.nextAction || "Pas de prochaine action renseignée.")}</p>
          <p class="subtle">Budget HT ${formatCurrency(project.budget || 0)} · Valeur temps estimée ${formatCurrency(estimatedValue)}</p>
        </article>
      `;
    })
    .join("");
}

function renderFinance() {
  ui.financeList.innerHTML = state.finance
    .map((item) => {
      const totalTtc = item.amountHt * (1 + item.vatRate / 100);
      const remaining = Math.max(totalTtc - item.paidAmount, 0);
      return `
        <article class="card-item">
          <h4>${escapeHtml(item.reference)}</h4>
          <p class="list-meta">${item.kind === "quote" ? "Devis" : "Facture"} · ${clientName(item.clientId)}</p>
          <div class="tag-row">
            <span class="tag">${escapeHtml(item.status)}</span>
            <span class="tag tag-warm">${formatCurrency(totalTtc)} TTC</span>
            <span class="tag ${remaining > 0 && item.kind === "invoice" ? "tag-danger" : ""}">
              Reste ${formatCurrency(remaining)}
            </span>
          </div>
          <p>${escapeHtml(item.label || "Sans libellé")}</p>
          <p class="subtle">Émis le ${formatDate(item.date)}${item.dueDate ? ` · Échéance ${formatDate(item.dueDate)}` : ""}</p>
        </article>
      `;
    })
    .join("");

  const metrics = computeMetrics();
  ui.financeSummary.innerHTML = `
    <div class="list-item">
      <h4>Facturé HT</h4>
      <p>${formatCurrency(metrics.invoicedHt)}</p>
    </div>
    <div class="list-item">
      <h4>TVA collectée</h4>
      <p>${formatCurrency(metrics.vatDue)}</p>
    </div>
    <div class="list-item">
      <h4>Encaissé TTC</h4>
      <p>${formatCurrency(metrics.annualRevenue)}</p>
    </div>
    <div class="list-item">
      <h4>Reste à encaisser</h4>
      <p>${formatCurrency(metrics.outstanding)}</p>
    </div>
    <div class="list-item">
      <h4>Charges cumulées</h4>
      <p>${formatCurrency(metrics.totalExpenses)}</p>
    </div>
    <div class="list-item">
      <h4>Résultat brut estimé</h4>
      <p>${formatCurrency(metrics.annualRevenue - metrics.totalExpenses)}</p>
    </div>
  `;
}

function renderExpenses() {
  ui.expenseList.innerHTML = state.expenses
    .map(
      (expense) => `
        <article class="card-item">
          <h4>${escapeHtml(expense.label)}</h4>
          <p class="list-meta">${escapeHtml(expense.category)} · ${formatDate(expense.date)}</p>
          <p>${formatCurrency(expense.amount)} TTC</p>
        </article>
      `
    )
    .join("");
}

function renderTimeEntries() {
  ui.timeList.innerHTML = state.timeEntries
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map(
      (entry) => `
        <article class="card-item">
          <h4>${projectName(entry.projectId)}</h4>
          <p class="list-meta">${escapeHtml(entry.category)} · ${formatDate(entry.date)}</p>
          <div class="tag-row">
            <span class="tag">${entry.hours.toFixed(2)} h</span>
            <span class="tag tag-warm">${formatCurrency(entry.hours * state.settings.hourlyRate)}</span>
          </div>
          <p>${escapeHtml(entry.note || "Sans commentaire")}</p>
        </article>
      `
    )
    .join("");
}

function renderPipelineColumns() {
  const statuses = ["A contacter", "En échange", "Proposition envoyée", "Gagné"];
  return statuses
    .map((status) => {
      const prospects = state.prospects.filter((item) => item.status === status);
      return `
        <div class="kanban-column">
          <h4>${status}</h4>
          <p class="subtle">${prospects.length} élément(s)</p>
        </div>
      `;
    })
    .join("");
}

function renderRevenueBars() {
  const monthly = groupInvoicesByMonth();
  const max = Math.max(...monthly.map((item) => item.value), 1);
  return monthly
    .map(
      (item) => `
        <div class="bar-item">
          <div class="quick-stat">
            <span>${item.label}</span>
            <strong>${formatCurrency(item.value)}</strong>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:${(item.value / max) * 100}%"></div></div>
        </div>
      `
    )
    .join("");
}

function renderTimeByProject() {
  return state.projects
    .map((project) => ({ project, hours: sumHours(project.id) }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5)
    .map(
      ({ project, hours }) => `
        <div class="list-item">
          <h4>${escapeHtml(project.name)}</h4>
          <p class="subtle">${hours.toFixed(1)} h · ${formatCurrency(hours * state.settings.hourlyRate)}</p>
        </div>
      `
    )
    .join("");
}

function computeMetrics() {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const currentYear = now.getFullYear();
  const invoices = state.finance.filter((item) => item.kind === "invoice");
  const issuedAmounts = invoices.reduce((sum, item) => sum + item.amountHt, 0);
  const monthlyRevenue = invoices
    .filter((item) => String(item.date).startsWith(currentMonth))
    .reduce((sum, item) => sum + item.paidAmount, 0);
  const annualRevenue = invoices
    .filter((item) => String(item.date).startsWith(String(currentYear)))
    .reduce((sum, item) => sum + item.paidAmount, 0);
  const outstanding = invoices.reduce((sum, item) => sum + Math.max(item.amountHt * (1 + item.vatRate / 100) - item.paidAmount, 0), 0);
  const vatDue = invoices.reduce((sum, item) => sum + item.amountHt * (item.vatRate / 100), 0);
  const monthlyExpenses = state.expenses
    .filter((item) => String(item.date).startsWith(currentMonth))
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = state.expenses.reduce((sum, item) => sum + item.amount, 0);
  const monthlyHours = state.timeEntries
    .filter((entry) => String(entry.date).startsWith(currentMonth))
    .reduce((sum, entry) => sum + entry.hours, 0);
  const activeProspects = state.prospects.filter(
    (prospect) => !["Gagné", "Perdu"].includes(prospect.status)
  ).length;
  const activeProjects = state.projects.filter((project) =>
    ["Cadrage", "En cours", "En attente"].includes(project.status)
  ).length;
  const upcomingDeadlines = state.projects.filter((project) => {
    if (!project.deadline) return false;
    const diff = daysBetween(now, new Date(project.deadline));
    return diff >= 0 && diff <= 14;
  });
  const overdueCount = invoices.filter((item) => {
    if (!item.dueDate) return false;
    return new Date(item.dueDate) < now && item.amountHt * (1 + item.vatRate / 100) > item.paidAmount;
  }).length;
  const averageHourlyValue = monthlyHours ? annualRevenue / Math.max(totalHours(), 1) : 0;
  const goalProgress = state.settings.annualGoal
    ? (annualRevenue / state.settings.annualGoal) * 100
    : 0;

  return {
    monthlyRevenue,
    annualRevenue,
    outstanding,
    vatDue,
    monthlyExpenses,
    totalExpenses,
    monthlyHours,
    activeProspects,
    activeProjects,
    upcomingDeadlines,
    overdueCount,
    averageHourlyValue,
    goalProgress,
    invoicedHt: issuedAmounts,
  };
}

function clientName(clientId) {
  return state.clients.find((client) => client.id === clientId)?.name || "Client non renseigné";
}

function projectName(projectId) {
  return state.projects.find((project) => project.id === projectId)?.name || "Projet non renseigné";
}

function sumHours(projectId) {
  return state.timeEntries
    .filter((entry) => entry.projectId === projectId)
    .reduce((sum, entry) => sum + entry.hours, 0);
}

function totalHours() {
  return state.timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
}

function groupInvoicesByMonth() {
  const map = new Map();
  state.finance
    .filter((item) => item.kind === "invoice")
    .forEach((item) => {
      const key = String(item.date).slice(0, 7);
      const current = map.get(key) || 0;
      map.set(key, current + item.paidAmount);
    });

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, value]) => ({
      label: formatMonth(key),
      value,
    }));
}

function persistAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : cloneData(defaultData);
  } catch (error) {
    return cloneData(defaultData);
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function shiftDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  const ms = 24 * 60 * 60 * 1000;
  return Math.round((b - a) / ms);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatMonth(value) {
  const [year, month] = value.split("-");
  return new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    year: "numeric",
  }).format(new Date(Number(year), Number(month) - 1, 1));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
