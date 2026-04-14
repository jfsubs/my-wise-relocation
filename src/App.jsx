import { useState, useMemo, useEffect, useRef, useCallback } from "react";

const COUNTRIES = [
  {
    name: "Germany", flag: "🇩🇪", region: "Europe", englishFriendly: 4, costOfLiving: 4, healthcare: 5, safety: 5, pathToPR: 4,
    visas: [
      { type: "Skilled Worker", category: "work", minEducation: "bachelors", fields: ["tech","engineering","healthcare","science","finance"], processingWeeks: [4,12], costUSD: 100, prYears: 5, url: "https://www.make-it-in-germany.com/en/visa-residence", notes: "Requires recognized qualification or equivalent experience. Blue Card available for high-demand fields with salary threshold ~€45,300." },
      { type: "Freelance / Self-Employed", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [6,16], costUSD: 200, prYears: 5, url: "https://www.make-it-in-germany.com/en/visa-residence", notes: "Must demonstrate economic interest or regional need. Popular with IT consultants, artists, translators." },
      { type: "Job Seeker Visa", category: "work", minEducation: "bachelors", fields: ["any"], processingWeeks: [4,12], costUSD: 100, prYears: null, url: "https://www.make-it-in-germany.com/en/visa-residence", notes: "6-month visa to search for employment. Must have recognized degree and ~€11,208 in blocked account." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 100, prYears: 3, url: "https://www.make-it-in-germany.com/en/visa-residence", notes: "For spouses and minor children. Spouse must demonstrate basic German (A1). Work permitted immediately." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [6,16], costUSD: 100, prYears: 6, url: "https://www.make-it-in-germany.com/en/visa-residence", notes: "Tuition-free at public universities. Need ~€11,208/year in blocked account. Can work 120 full days/year." },
      { type: "Digital Nomad (Freiberufler)", category: "remote", minEducation: "none", fields: ["tech","creative","consulting"], processingWeeks: [6,16], costUSD: 200, prYears: 5, url: "https://www.make-it-in-germany.com/en/visa-residence", notes: "No formal digital nomad visa but freelance visa is commonly used by remote workers with non-German clients." },
    ]
  },
  {
    name: "Portugal", flag: "🇵🇹", region: "Europe", englishFriendly: 4, costOfLiving: 4, healthcare: 4, safety: 5, pathToPR: 5,
    visas: [
      { type: "D7 Passive Income", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 180, prYears: 5, url: "https://vistos.mne.gov.pt/en/national-visas", notes: "For retirees or those with passive income. Min ~€760/month. Very popular with US retirees." },
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 220, prYears: null, url: "https://vistos.mne.gov.pt/en/national-visas", notes: "Must earn 4x Portuguese minimum wage (~€3,040/month). 1-year renewable, can convert to D7." },
      { type: "Tech Visa", category: "work", minEducation: "bachelors", fields: ["tech"], processingWeeks: [4,8], costUSD: 180, prYears: 5, url: "https://vistos.mne.gov.pt/en/national-visas", notes: "Fast-track work visa for IAPMEI-certified tech companies." },
      { type: "D2 Entrepreneur Visa", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [8,16], costUSD: 450, prYears: 5, url: "https://vistos.mne.gov.pt/en/national-visas", notes: "For business founders. Need business plan demonstrating investment and job creation." },
      { type: "Golden Visa (Investment)", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 700, prYears: 5, url: "https://vistos.mne.gov.pt/en/national-visas", notes: "Investment-based residency. Options include €500K fund investment. Real estate option ended 2023." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 180, prYears: 5, url: "https://vistos.mne.gov.pt/en/national-visas", notes: "For family members of legal residents. Includes spouse, minor children, and dependent parents." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 180, prYears: 6, url: "https://vistos.mne.gov.pt/en/national-visas", notes: "Tuition typically €2,000-7,000/year. Can work part-time. Path to residency after studies." },
    ]
  },
  {
    name: "Spain", flag: "🇪🇸", region: "Europe", englishFriendly: 3, costOfLiving: 4, healthcare: 5, safety: 4, pathToPR: 4,
    visas: [
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 250, prYears: 5, url: "https://www.exteriores.gob.es/Consulados/nuevayork/en/ServiciosConsulares/Paginas/Visados.aspx", notes: "Must earn from non-Spanish companies. ~€2,520/month minimum. 3-year visa, renewable." },
      { type: "Non-Lucrative Visa", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 250, prYears: 5, url: "https://www.exteriores.gob.es/Consulados/nuevayork/en/ServiciosConsulares/Paginas/Visados.aspx", notes: "For retirees with passive income. ~€2,400/month required. Cannot work in Spain." },
      { type: "Highly Qualified Professional", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science","finance","healthcare"], processingWeeks: [4,12], costUSD: 350, prYears: 5, url: "https://www.exteriores.gob.es/Consulados/nuevayork/en/ServiciosConsulares/Paginas/Visados.aspx", notes: "For senior managers and specialists. Employer-sponsored." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 250, prYears: 5, url: "https://www.exteriores.gob.es/Consulados/nuevayork/en/ServiciosConsulares/Paginas/Visados.aspx", notes: "Spouse and minor children of legal residents." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: null, url: "https://www.exteriores.gob.es/Consulados/nuevayork/en/ServiciosConsulares/Paginas/Visados.aspx", notes: "Study time counts partially toward residency. Can work 20hrs/week." },
    ]
  },
  {
    name: "Netherlands", flag: "🇳🇱", region: "Europe", englishFriendly: 5, costOfLiving: 3, healthcare: 5, safety: 5, pathToPR: 4,
    visas: [
      { type: "Highly Skilled Migrant", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science","finance","healthcare"], processingWeeks: [2,6], costUSD: 350, prYears: 5, url: "https://ind.nl/en/residence-permits", notes: "Employer must be IND-recognized sponsor. Salary threshold ~€5,008/month. 30% tax ruling may apply." },
      { type: "DAFT Treaty (US only)", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 1500, prYears: 5, url: "https://ind.nl/en/residence-permits", notes: "Dutch American Friendship Treaty. Only €4,500 investment needed. Exclusively for US citizens." },
      { type: "Startup Visa", category: "work", minEducation: "none", fields: ["tech","any"], processingWeeks: [4,12], costUSD: 400, prYears: 5, url: "https://ind.nl/en/residence-permits", notes: "1-year visa to develop innovative startup. Need approved facilitator." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 350, prYears: 5, url: "https://ind.nl/en/residence-permits", notes: "For partners and children. Income requirement ~€1,997/month." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 350, prYears: 6, url: "https://ind.nl/en/residence-permits", notes: "Many English-taught programs. Tuition €8,000-20,000/year for non-EU." },
    ]
  },
  {
    name: "Mexico", flag: "🇲🇽", region: "Americas", englishFriendly: 3, costOfLiving: 4, healthcare: 3, safety: 3, pathToPR: 4,
    visas: [
      { type: "Temporary Resident", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [2,8], costUSD: 50, prYears: 4, url: "https://www.gob.mx/inm", notes: "Income-based: ~$2,600/month or $43,000 in savings. 1-4 year visa." },
      { type: "Permanent Resident", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [2,8], costUSD: 50, prYears: 0, url: "https://www.gob.mx/inm", notes: "Direct PR if income ~$4,300/month or $172,000 in savings." },
      { type: "Family Unity", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 50, prYears: 2, url: "https://www.gob.mx/inm", notes: "For spouse and children of Mexican citizens or permanent residents." },
      { type: "Digital Nomad (Temp. Resident)", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,8], costUSD: 50, prYears: 4, url: "https://www.gob.mx/inm", notes: "No formal DN visa but temporary resident visa is widely used by remote workers." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [2,6], costUSD: 50, prYears: null, url: "https://www.gob.mx/inm", notes: "Very affordable tuition at public universities. Limited work authorization." },
    ]
  },
  {
    name: "Costa Rica", flag: "🇨🇷", region: "Americas", englishFriendly: 3, costOfLiving: 3, healthcare: 4, safety: 4, pathToPR: 4,
    visas: [
      { type: "Rentista (Income)", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 300, prYears: 3, url: "https://www.migracion.go.cr/", notes: "Must prove $2,500/month income for at least 2 years." },
      { type: "Pensionado (Retiree)", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 300, prYears: 3, url: "https://www.migracion.go.cr/", notes: "Need $1,000/month pension. Very popular US retiree destination." },
      { type: "Inversionista (Investor)", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 300, prYears: 3, url: "https://www.migracion.go.cr/", notes: "Min $150,000 investment in business or real estate." },
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,4], costUSD: 100, prYears: null, url: "https://www.migracion.go.cr/", notes: "Must earn $3,000/month ($4,000 for families). 1-year visa." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 300, prYears: 3, url: "https://www.migracion.go.cr/", notes: "For spouse and dependents of residents." },
    ]
  },
  {
    name: "Japan", flag: "🇯🇵", region: "Asia", englishFriendly: 2, costOfLiving: 4, healthcare: 5, safety: 5, pathToPR: 3,
    visas: [
      { type: "Engineer/Specialist", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science"], processingWeeks: [4,12], costUSD: 0, prYears: 10, url: "https://www.mofa.go.jp/j_info/visit/visa/index.html", notes: "For technical roles. Employer-sponsored. No visa fee for US citizens." },
      { type: "Highly Skilled Professional", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science","finance"], processingWeeks: [2,6], costUSD: 0, prYears: 3, url: "https://www.mofa.go.jp/j_info/visit/visa/index.html", notes: "Points-based fast-track. 70+ points = 3yr PR path; 80+ = 1yr PR path." },
      { type: "Business Manager", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 0, prYears: 10, url: "https://www.mofa.go.jp/j_info/visit/visa/index.html", notes: "Need ~$35,000 investment and physical office. Must hire 2+ employees." },
      { type: "Spouse of Japanese National", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 0, prYears: 3, url: "https://www.mofa.go.jp/j_info/visit/visa/index.html", notes: "Unrestricted work authorization. PR after 3 years of marriage." },
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 0, prYears: null, url: "https://www.mofa.go.jp/j_info/visit/visa/index.html", notes: "Launched 2024. 6-month stay, must earn $68,000+/year." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 0, prYears: null, url: "https://www.mofa.go.jp/j_info/visit/visa/index.html", notes: "Can work 28hrs/week. Many MEXT scholarships available." },
    ]
  },
  {
    name: "Canada", flag: "🇨🇦", region: "Americas", englishFriendly: 5, costOfLiving: 2, healthcare: 4, safety: 5, pathToPR: 5,
    visas: [
      { type: "Express Entry (Skilled)", category: "work", minEducation: "bachelors", fields: ["any"], processingWeeks: [24,36], costUSD: 850, prYears: 0, url: "https://www.canada.ca/en/immigration-refugees-citizenship.html", notes: "Points-based PR system (CRS score). Direct permanent residency." },
      { type: "Provincial Nominee (PNP)", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [12,52], costUSD: 850, prYears: 0, url: "https://www.canada.ca/en/immigration-refugees-citizenship.html", notes: "Each province has own criteria. Can boost Express Entry score by 600 points." },
      { type: "Start-Up Visa", category: "work", minEducation: "none", fields: ["tech","any"], processingWeeks: [24,52], costUSD: 850, prYears: 0, url: "https://www.canada.ca/en/immigration-refugees-citizenship.html", notes: "For entrepreneurs with designated Canadian organization support." },
      { type: "Family Sponsorship", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [24,52], costUSD: 850, prYears: 0, url: "https://www.canada.ca/en/immigration-refugees-citizenship.html", notes: "Canadian citizen or PR can sponsor spouse, children, parents." },
      { type: "Study Permit", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [8,20], costUSD: 120, prYears: 3, url: "https://www.canada.ca/en/immigration-refugees-citizenship.html", notes: "Post-graduation work permit for 1-3 years. Strong PR pathway." },
    ]
  },
  {
    name: "France", flag: "🇫🇷", region: "Europe", englishFriendly: 3, costOfLiving: 4, healthcare: 5, safety: 4, pathToPR: 4,
    visas: [
      { type: "Talent Passport (Skilled)", category: "work", minEducation: "masters", fields: ["tech","engineering","science","finance"], processingWeeks: [4,16], costUSD: 250, prYears: 5, url: "https://france-visas.gouv.fr/en/web/france-visas", notes: "4-year renewable visa. Salary threshold ~€39,000. Family included." },
      { type: "Talent Passport (Entrepreneur)", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [6,20], costUSD: 250, prYears: 5, url: "https://france-visas.gouv.fr/en/web/france-visas", notes: "For innovative business founders. Need €30,000 investment." },
      { type: "Visitor Visa (Non-Working)", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 200, prYears: 5, url: "https://france-visas.gouv.fr/en/web/france-visas", notes: "For those with sufficient income. Cannot work. Popular with retirees." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 200, prYears: 5, url: "https://france-visas.gouv.fr/en/web/france-visas", notes: "For spouse and children. Must meet income and housing requirements." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: 5, url: "https://france-visas.gouv.fr/en/web/france-visas", notes: "Low tuition at public universities (~€3,770/year for non-EU)." },
    ]
  },
  {
    name: "Italy", flag: "🇮🇹", region: "Europe", englishFriendly: 2, costOfLiving: 4, healthcare: 4, safety: 4, pathToPR: 4,
    visas: [
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: 5, url: "https://vistoperitalia.esteri.it/home/en", notes: "Launched 2024. Min €28,000/year from non-Italian sources." },
      { type: "Elective Residence", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 200, prYears: 5, url: "https://vistoperitalia.esteri.it/home/en", notes: "For retirees with passive income. ~€31,000/year recommended." },
      { type: "EU Blue Card", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science","healthcare","finance"], processingWeeks: [8,20], costUSD: 200, prYears: 5, url: "https://vistoperitalia.esteri.it/home/en", notes: "Employer-sponsored. Salary threshold ~€25,000 (lower than most EU)." },
      { type: "Investor Visa", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: 5, url: "https://vistoperitalia.esteri.it/home/en", notes: "Min €250K into startup, €500K into company, €2M in govt bonds." },
      { type: "Jure Sanguinis (Ancestry)", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [52,156], costUSD: 600, prYears: 0, url: "https://vistoperitalia.esteri.it/home/en", notes: "Italian citizenship by descent. Very powerful if you qualify." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: null, url: "https://vistoperitalia.esteri.it/home/en", notes: "Low tuition (€1,000-4,000/year). Can work 20hrs/week." },
    ]
  },
  {
    name: "Thailand", flag: "🇹🇭", region: "Asia", englishFriendly: 3, costOfLiving: 5, healthcare: 3, safety: 4, pathToPR: 2,
    visas: [
      { type: "Long-Term Resident (LTR)", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 1500, prYears: null, url: "https://www.immigration.go.th/", notes: "10-year visa. Need $80K/year income or $250K+ assets. 17% flat tax." },
      { type: "SMART Visa", category: "work", minEducation: "bachelors", fields: ["tech","science","engineering"], processingWeeks: [4,8], costUSD: 300, prYears: null, url: "https://www.immigration.go.th/", notes: "For specialists in targeted industries. 4-year visa." },
      { type: "Retirement Visa (O-A)", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 60, prYears: null, url: "https://www.immigration.go.th/", notes: "Age 50+. Need 800K THB in Thai bank or 65K THB/month income." },
      { type: "Elite Visa", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,8], costUSD: 17000, prYears: null, url: "https://www.immigration.go.th/", notes: "Membership-based. 5-20 year options. VIP services." },
      { type: "Education Visa (ED)", category: "study", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 60, prYears: null, url: "https://www.immigration.go.th/", notes: "For language school or university. Renewable every 90 days." },
    ]
  },
  {
    name: "Uruguay", flag: "🇺🇾", region: "Americas", englishFriendly: 2, costOfLiving: 3, healthcare: 4, safety: 4, pathToPR: 5,
    visas: [
      { type: "Temporary Residence", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 200, prYears: 3, url: "https://www.gub.uy/ministerio-relaciones-exteriores/", notes: "Need proof of income (~$1,500/month). Can work immediately." },
      { type: "Retirement / Rentista", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 200, prYears: 3, url: "https://www.gub.uy/ministerio-relaciones-exteriores/", notes: "Need $1,500/month income. Citizenship possible after 3-5 years." },
      { type: "Investor Residence", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 200, prYears: 3, url: "https://www.gub.uy/ministerio-relaciones-exteriores/", notes: "Invest in local business or real estate." },
    ]
  },
  {
    name: "United Kingdom", flag: "🇬🇧", region: "Europe", englishFriendly: 5, costOfLiving: 2, healthcare: 4, safety: 4, pathToPR: 3,
    visas: [
      { type: "Skilled Worker Visa", category: "work", minEducation: "none", fields: ["tech","engineering","healthcare","science","finance"], processingWeeks: [3,8], costUSD: 800, prYears: 5, url: "https://www.gov.uk/browse/visas-immigration", notes: "Employer-sponsored. Points-based system. Salary threshold ~£26,200." },
      { type: "Global Talent Visa", category: "work", minEducation: "none", fields: ["tech","science","creative"], processingWeeks: [4,8], costUSD: 800, prYears: 3, url: "https://www.gov.uk/browse/visas-immigration", notes: "For leaders in academia, research, digital tech, or arts." },
      { type: "Innovator Founder Visa", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 1400, prYears: 3, url: "https://www.gov.uk/browse/visas-immigration", notes: "For innovative business founders. Min £50,000 investment." },
      { type: "Family Visa", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [12,24], costUSD: 1900, prYears: 5, url: "https://www.gov.uk/browse/visas-immigration", notes: "For partners/spouses. Income requirement £29,000+. Expensive process." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [3,6], costUSD: 500, prYears: null, url: "https://www.gov.uk/browse/visas-immigration", notes: "Can work 20hrs/week. Graduate visa (2-3 years) after completion." },
    ]
  },
  {
    name: "Australia", flag: "🇦🇺", region: "Oceania", englishFriendly: 5, costOfLiving: 2, healthcare: 5, safety: 5, pathToPR: 4,
    visas: [
      { type: "Skilled Independent (189)", category: "work", minEducation: "bachelors", fields: ["tech","engineering","healthcare","science","finance"], processingWeeks: [26,78], costUSD: 2800, prYears: 0, url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder", notes: "Points-based PR visa. No sponsor needed." },
      { type: "Employer Sponsored (482)", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [8,26], costUSD: 1900, prYears: 3, url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder", notes: "Temporary Skill Shortage visa. Can lead to PR via 186 visa." },
      { type: "Global Talent (858)", category: "work", minEducation: "none", fields: ["tech","science","engineering"], processingWeeks: [4,16], costUSD: 2800, prYears: 0, url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder", notes: "For internationally recognized individuals. Direct PR." },
      { type: "Business Innovation (188)", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [16,52], costUSD: 4300, prYears: 4, url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder", notes: "For business owners/investors. Multiple streams." },
      { type: "Partner Visa (820/801)", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [26,104], costUSD: 5700, prYears: 2, url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder", notes: "Very expensive. Long processing times." },
      { type: "Student Visa (500)", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 450, prYears: null, url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder", notes: "Can work 48hrs per fortnight. Post-study work visa available." },
    ]
  },
  {
    name: "New Zealand", flag: "🇳🇿", region: "Oceania", englishFriendly: 5, costOfLiving: 3, healthcare: 4, safety: 5, pathToPR: 4,
    visas: [
      { type: "Skilled Migrant (SMC)", category: "work", minEducation: "bachelors", fields: ["tech","engineering","healthcare","science"], processingWeeks: [12,36], costUSD: 350, prYears: 2, url: "https://www.immigration.govt.nz/new-zealand-visas", notes: "Points-based system. Need job offer or Green List occupation." },
      { type: "Straight to Residence (Green List)", category: "work", minEducation: "bachelors", fields: ["tech","engineering","healthcare","science"], processingWeeks: [8,24], costUSD: 350, prYears: 0, url: "https://www.immigration.govt.nz/new-zealand-visas", notes: "Direct PR for in-demand roles on Green List Tier 1." },
      { type: "Entrepreneur Work Visa", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [12,24], costUSD: 350, prYears: 3, url: "https://www.immigration.govt.nz/new-zealand-visas", notes: "Need viable business plan and NZ$100K investment capital." },
      { type: "Partnership Visa", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,26], costUSD: 350, prYears: 2, url: "https://www.immigration.govt.nz/new-zealand-visas", notes: "Must prove genuine relationship (12+ months living together)." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 200, prYears: null, url: "https://www.immigration.govt.nz/new-zealand-visas", notes: "Can work 20hrs/week. Post-study work visa 1-3 years." },
    ]
  },
  {
    name: "South Korea", flag: "🇰🇷", region: "Asia", englishFriendly: 2, costOfLiving: 4, healthcare: 5, safety: 5, pathToPR: 4,
    visas: [
      { type: "E-7 Professional Work", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science","finance"], processingWeeks: [4,12], costUSD: 100, prYears: 5, url: "https://www.visa.go.kr/main/openMain.do", notes: "For professionals and specialists. Employer-sponsored." },
      { type: "D-8 Corporate Investment", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 100, prYears: 5, url: "https://www.visa.go.kr/main/openMain.do", notes: "Invest ₩100M (~$75K) minimum in a Korean company." },
      { type: "Digital Nomad (Workcation)", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,4], costUSD: 50, prYears: null, url: "https://www.visa.go.kr/main/openMain.do", notes: "Launched 2024. 1-year visa, must earn $65K+/year." },
      { type: "F-6 Marriage Visa", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 100, prYears: 2, url: "https://www.visa.go.kr/main/openMain.do", notes: "For spouses of Korean nationals. PR after 2 years." },
      { type: "D-2 Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 60, prYears: null, url: "https://www.visa.go.kr/main/openMain.do", notes: "~$3,000-8,000/year tuition. Many scholarships available." },
    ]
  },
  {
    name: "Panama", flag: "🇵🇦", region: "Americas", englishFriendly: 3, costOfLiving: 4, healthcare: 3, safety: 3, pathToPR: 5,
    visas: [
      { type: "Friendly Nations Visa", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 500, prYears: 0, url: "https://www.migracion.gob.pa/", notes: "Direct PR for US citizens. Need $5,000 bank deposit." },
      { type: "Pensionado (Retiree)", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 400, prYears: 0, url: "https://www.migracion.gob.pa/", notes: "Need $1,000/month pension. Extensive discounts." },
      { type: "Self-Economic Solvency", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 500, prYears: 0, url: "https://www.migracion.gob.pa/", notes: "Invest $300K in real estate or $500K bank deposit. Immediate PR." },
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 300, prYears: null, url: "https://www.migracion.gob.pa/", notes: "Must earn $3,000/month from foreign employer." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 300, prYears: null, url: "https://www.migracion.gob.pa/", notes: "Low tuition at public universities." },
    ]
  },
  {
    name: "Colombia", flag: "🇨🇴", region: "Americas", englishFriendly: 2, costOfLiving: 5, healthcare: 4, safety: 3, pathToPR: 4,
    visas: [
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 200, prYears: null, url: "https://www.cancilleria.gov.co/en/procedures_services/visa", notes: "Must earn ~$900/month. 2-year visa. Very low cost of living." },
      { type: "Work Visa (M-Type)", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 250, prYears: 5, url: "https://www.cancilleria.gov.co/en/procedures_services/visa", notes: "Employer-sponsored with formal contract." },
      { type: "Investor Visa", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 250, prYears: 5, url: "https://www.cancilleria.gov.co/en/procedures_services/visa", notes: "Invest ~$85,000+ in Colombian company or real estate." },
      { type: "Retirement Visa", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 250, prYears: 5, url: "https://www.cancilleria.gov.co/en/procedures_services/visa", notes: "Need pension/retirement income of ~$900/month." },
      { type: "Marriage/Partner Visa", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 250, prYears: 3, url: "https://www.cancilleria.gov.co/en/procedures_services/visa", notes: "For spouses of Colombian citizens. Faster PR path." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [2,8], costUSD: 200, prYears: null, url: "https://www.cancilleria.gov.co/en/procedures_services/visa", notes: "Very affordable tuition ($1,000-5,000/year)." },
    ]
  },
  {
    name: "Czech Republic", flag: "🇨🇿", region: "Europe", englishFriendly: 3, costOfLiving: 4, healthcare: 4, safety: 5, pathToPR: 4,
    visas: [
      { type: "Employee Card", category: "work", minEducation: "none", fields: ["tech","engineering","science","finance"], processingWeeks: [8,24], costUSD: 100, prYears: 5, url: "https://www.mvcr.cz/mvcren/article/third-country-nationals-702214.aspx", notes: "Dual work/residence permit. Tied to specific employer initially." },
      { type: "EU Blue Card", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science","healthcare","finance"], processingWeeks: [8,20], costUSD: 100, prYears: 5, url: "https://www.mvcr.cz/mvcren/article/third-country-nationals-702214.aspx", notes: "For qualified workers with salary 1.5x Czech average." },
      { type: "Business/Trade License", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 100, prYears: 5, url: "https://www.mvcr.cz/mvcren/article/third-country-nationals-702214.aspx", notes: "Trade license allows self-employment. Popular with freelancers." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 100, prYears: 5, url: "https://www.mvcr.cz/mvcren/article/third-country-nationals-702214.aspx", notes: "For spouse and children of long-term residents." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [8,16], costUSD: 100, prYears: null, url: "https://www.mvcr.cz/mvcren/article/third-country-nationals-702214.aspx", notes: "Tuition-free in Czech. English programs €2,000-15,000/year." },
    ]
  },
  {
    name: "Greece", flag: "🇬🇷", region: "Europe", englishFriendly: 3, costOfLiving: 4, healthcare: 3, safety: 4, pathToPR: 4,
    visas: [
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: null, url: "https://migration.gov.gr/en/", notes: "Must earn €3,500/month. 50% tax reduction for 7 years." },
      { type: "Financially Independent", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 200, prYears: 5, url: "https://migration.gov.gr/en/", notes: "Need ~€2,000/month passive income." },
      { type: "Golden Visa (Investment)", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 500, prYears: 5, url: "https://migration.gov.gr/en/", notes: "Real estate investment from €250,000." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: null, url: "https://migration.gov.gr/en/", notes: "Growing number of English-taught programs." },
    ]
  },
  {
    name: "Estonia", flag: "🇪🇪", region: "Europe", englishFriendly: 4, costOfLiving: 4, healthcare: 4, safety: 5, pathToPR: 4,
    visas: [
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 120, prYears: null, url: "https://www.politsei.ee/en/instructions/residence-permit", notes: "Must earn €3,504/month gross. Leading digital society." },
      { type: "Startup Visa", category: "work", minEducation: "none", fields: ["tech","any"], processingWeeks: [4,12], costUSD: 120, prYears: 5, url: "https://www.politsei.ee/en/instructions/residence-permit", notes: "For scalable startups. Must pass Startup Committee evaluation." },
      { type: "Employment (TRP)", category: "work", minEducation: "none", fields: ["tech","engineering","science"], processingWeeks: [4,12], costUSD: 120, prYears: 5, url: "https://www.politsei.ee/en/instructions/residence-permit", notes: "Employer-sponsored. Fast-track for ICT specialists." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 120, prYears: 5, url: "https://www.politsei.ee/en/instructions/residence-permit", notes: "For close family members of Estonian residents." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 120, prYears: null, url: "https://www.politsei.ee/en/instructions/residence-permit", notes: "Many English-taught programs. Tuition €1,500-7,500/year." },
    ]
  },
  {
    name: "Austria", flag: "🇦🇹", region: "Europe", englishFriendly: 4, costOfLiving: 3, healthcare: 5, safety: 5, pathToPR: 4,
    visas: [
      { type: "Red-White-Red Card (Skilled)", category: "work", minEducation: "bachelors", fields: ["tech","engineering","healthcare","science","finance"], processingWeeks: [8,16], costUSD: 180, prYears: 5, url: "https://www.migration.gv.at/en/", notes: "Points-based for skilled workers. Shortage occupations get fast-track." },
      { type: "EU Blue Card", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science","healthcare","finance"], processingWeeks: [6,16], costUSD: 180, prYears: 5, url: "https://www.migration.gv.at/en/", notes: "For highly qualified workers. Salary above €3,750/month gross." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 180, prYears: 5, url: "https://www.migration.gv.at/en/", notes: "German A1 required before entry for spouses." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [8,16], costUSD: 180, prYears: null, url: "https://www.migration.gv.at/en/", notes: "Low tuition at public universities (~€1,500/year for non-EU)." },
    ]
  },
  {
    name: "Ireland", flag: "🇮🇪", region: "Europe", englishFriendly: 5, costOfLiving: 2, healthcare: 4, safety: 5, pathToPR: 4,
    visas: [
      { type: "Critical Skills Employment", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science","healthcare","finance"], processingWeeks: [4,12], costUSD: 1200, prYears: 2, url: "https://www.irishimmigration.ie/", notes: "For in-demand occupations. €38,000 min salary." },
      { type: "General Employment Permit", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [8,16], costUSD: 1200, prYears: 5, url: "https://www.irishimmigration.ie/", notes: "Min €34,000 salary. Labour market test required." },
      { type: "Startup Entrepreneur Programme", category: "work", minEducation: "none", fields: ["tech","any"], processingWeeks: [8,16], costUSD: 500, prYears: 5, url: "https://www.irishimmigration.ie/", notes: "Need €50,000 funding and innovative business idea." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [12,26], costUSD: 400, prYears: 5, url: "https://www.irishimmigration.ie/", notes: "For immediate family of employment permit holders." },
      { type: "Student Visa (Stamp 2)", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 400, prYears: null, url: "https://www.irishimmigration.ie/", notes: "Can work 20hrs/week. Strong tech job market." },
    ]
  },
  {
    name: "Malaysia", flag: "🇲🇾", region: "Asia", englishFriendly: 4, costOfLiving: 5, healthcare: 4, safety: 4, pathToPR: 2,
    visas: [
      { type: "DE Rantau (Digital Nomad)", category: "remote", minEducation: "none", fields: ["tech"], processingWeeks: [2,6], costUSD: 250, prYears: null, url: "https://www.imi.gov.my/en/", notes: "Must earn $24,000+/year. 1-year visa, renewable." },
      { type: "Employment Pass", category: "work", minEducation: "bachelors", fields: ["tech","engineering","finance","science"], processingWeeks: [4,12], costUSD: 150, prYears: null, url: "https://www.imi.gov.my/en/", notes: "Employer-sponsored. Min salary RM5,000-10,000/month." },
      { type: "MM2H (My Second Home)", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [12,36], costUSD: 500, prYears: null, url: "https://www.imi.gov.my/en/", notes: "10-year renewable. RM1M liquid assets required." },
      { type: "Student Pass", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 100, prYears: null, url: "https://www.imi.gov.my/en/", notes: "Many English-taught programs. Very affordable tuition." },
    ]
  },
  {
    name: "Taiwan", flag: "🇹🇼", region: "Asia", englishFriendly: 3, costOfLiving: 4, healthcare: 5, safety: 5, pathToPR: 3,
    visas: [
      { type: "Gold Card", category: "work", minEducation: "none", fields: ["tech","science","finance","creative"], processingWeeks: [4,12], costUSD: 310, prYears: 5, url: "https://goldcard.nat.gov.tw/en/", notes: "Popular 3-year open work permit. No employer needed. Tax benefits." },
      { type: "Entrepreneur Visa", category: "work", minEducation: "none", fields: ["tech","any"], processingWeeks: [4,12], costUSD: 150, prYears: 5, url: "https://goldcard.nat.gov.tw/en/", notes: "Need NT$2M (~$63K) investment or incubator support." },
      { type: "Spouse/Family ARC", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 100, prYears: 5, url: "https://goldcard.nat.gov.tw/en/", notes: "Open work rights. Path to APRC after 5 years." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [2,6], costUSD: 100, prYears: null, url: "https://goldcard.nat.gov.tw/en/", notes: "Affordable tuition (~$2,000-5,000/year)." },
    ]
  },
  {
    name: "Vietnam", flag: "🇻🇳", region: "Asia", englishFriendly: 2, costOfLiving: 5, healthcare: 3, safety: 4, pathToPR: 2,
    visas: [
      { type: "Work Permit", category: "work", minEducation: "bachelors", fields: ["tech","engineering","finance"], processingWeeks: [4,12], costUSD: 150, prYears: null, url: "https://evisa.xuatnhapcanh.gov.vn/en_US/web/guest/home", notes: "Employer-sponsored. Must have degree + 3 years experience." },
      { type: "Investor Visa", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 200, prYears: null, url: "https://evisa.xuatnhapcanh.gov.vn/en_US/web/guest/home", notes: "Invest in Vietnamese company. Up to 5-year visa." },
      { type: "Digital Nomad (Business Visa)", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [1,2], costUSD: 100, prYears: null, url: "https://evisa.xuatnhapcanh.gov.vn/en_US/web/guest/home", notes: "Business visa allows 1-year stay. Extremely low cost of living." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [2,4], costUSD: 50, prYears: null, url: "https://evisa.xuatnhapcanh.gov.vn/en_US/web/guest/home", notes: "Very affordable. Growing number of international programs." },
    ]
  },
  {
    name: "Ecuador", flag: "🇪🇨", region: "Americas", englishFriendly: 2, costOfLiving: 5, healthcare: 3, safety: 3, pathToPR: 5,
    visas: [
      { type: "Rentista (Income) Visa", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 500, prYears: 2, url: "https://www.cancilleria.gob.ec/", notes: "Need $1,375/month income. Uses US dollar." },
      { type: "Investor Visa", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 500, prYears: 2, url: "https://www.cancilleria.gob.ec/", notes: "Invest $42,000+ in real estate or local business." },
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 450, prYears: null, url: "https://www.cancilleria.gob.ec/", notes: "Must earn $1,375/month. US dollar economy." },
      { type: "Family/Dependent Visa", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 500, prYears: 2, url: "https://www.cancilleria.gob.ec/", notes: "Same timeline to PR as primary applicant." },
      { type: "Professional Visa", category: "work", minEducation: "bachelors", fields: ["any"], processingWeeks: [4,12], costUSD: 500, prYears: 2, url: "https://www.cancilleria.gob.ec/", notes: "For professionals with degree and employer sponsorship." },
    ]
  },
  {
    name: "Switzerland", flag: "🇨🇭", region: "Europe", englishFriendly: 4, costOfLiving: 1, healthcare: 5, safety: 5, pathToPR: 3,
    visas: [
      { type: "B Permit (Residence)", category: "work", minEducation: "none", fields: ["tech","engineering","science","finance","healthcare"], processingWeeks: [8,20], costUSD: 150, prYears: 10, url: "https://www.sem.admin.ch/sem/en/home/themen/einreise.html", notes: "For employment over 1 year. Non-EU citizens face strict quotas." },
      { type: "Entrepreneur / Self-Employed", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [12,30], costUSD: 200, prYears: 10, url: "https://www.sem.admin.ch/sem/en/home/themen/einreise.html", notes: "Must create jobs for Swiss residents. Very difficult for non-EU." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 150, prYears: 10, url: "https://www.sem.admin.ch/sem/en/home/themen/einreise.html", notes: "For spouse and children of B/C permit holders." },
      { type: "Student Permit", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [8,16], costUSD: 150, prYears: null, url: "https://www.sem.admin.ch/sem/en/home/themen/einreise.html", notes: "Tuition CHF 500-2,000/semester. Can work 15hrs/week." },
    ]
  },
  {
    name: "Sweden", flag: "🇸🇪", region: "Europe", englishFriendly: 5, costOfLiving: 3, healthcare: 5, safety: 4, pathToPR: 4,
    visas: [
      { type: "Work Permit", category: "work", minEducation: "none", fields: ["tech","engineering","healthcare","science","finance"], processingWeeks: [4,20], costUSD: 250, prYears: 4, url: "https://www.migrationsverket.se/English/Private-individuals.html", notes: "Min salary SEK 27,360/month. PR after 4 years." },
      { type: "Self-Employment", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 250, prYears: 4, url: "https://www.migrationsverket.se/English/Private-individuals.html", notes: "Must prove sufficient funds for 2 years." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,30], costUSD: 250, prYears: 4, url: "https://www.migrationsverket.se/English/Private-individuals.html", notes: "Long processing times. Income and housing requirements." },
      { type: "Student Residence Permit", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: null, url: "https://www.migrationsverket.se/English/Private-individuals.html", notes: "Many English-taught programs. Can work without limit." },
    ]
  },
  {
    name: "Denmark", flag: "🇩🇰", region: "Europe", englishFriendly: 5, costOfLiving: 2, healthcare: 5, safety: 5, pathToPR: 4,
    visas: [
      { type: "Pay Limit Scheme", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 350, prYears: 4, url: "https://www.nyidanmark.dk/en-GB", notes: "Just need job offer above DKK 465,000 (~$67K). Very straightforward." },
      { type: "Positive List (Skilled)", category: "work", minEducation: "bachelors", fields: ["tech","engineering","healthcare","science"], processingWeeks: [4,12], costUSD: 350, prYears: 4, url: "https://www.nyidanmark.dk/en-GB", notes: "For occupations on Denmark's shortage list." },
      { type: "Startup Denmark", category: "work", minEducation: "none", fields: ["tech","any"], processingWeeks: [4,12], costUSD: 350, prYears: null, url: "https://www.nyidanmark.dk/en-GB", notes: "For innovative, scalable startups. 2-year permit." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 350, prYears: 4, url: "https://www.nyidanmark.dk/en-GB", notes: "Strict requirements. Spouses must be 24+." },
      { type: "Student Residence Permit", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 300, prYears: null, url: "https://www.nyidanmark.dk/en-GB", notes: "Many English-taught programs. Can work 20hrs/week." },
    ]
  },
  {
    name: "Croatia", flag: "🇭🇷", region: "Europe", englishFriendly: 4, costOfLiving: 4, healthcare: 3, safety: 5, pathToPR: 4,
    visas: [
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 100, prYears: null, url: "https://mup.gov.hr/aliens-702/702", notes: "Must earn €2,539/month. No Croatian income tax." },
      { type: "Work Permit", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 80, prYears: 5, url: "https://mup.gov.hr/aliens-702/702", notes: "Employer-sponsored. EU/Schengen member since 2023." },
      { type: "Company Formation", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 100, prYears: 5, url: "https://mup.gov.hr/aliens-702/702", notes: "Register a d.o.o. (LLC) with €2,500 minimum capital." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 80, prYears: 5, url: "https://mup.gov.hr/aliens-702/702", notes: "Standard EU framework." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 80, prYears: null, url: "https://mup.gov.hr/aliens-702/702", notes: "Affordable tuition. Growing English-taught programs." },
    ]
  },
  {
    name: "Belgium", flag: "🇧🇪", region: "Europe", englishFriendly: 4, costOfLiving: 3, healthcare: 5, safety: 4, pathToPR: 4,
    visas: [
      { type: "Single Permit (Work)", category: "work", minEducation: "none", fields: ["tech","engineering","science","finance","healthcare"], processingWeeks: [8,20], costUSD: 200, prYears: 5, url: "https://dofi.ibz.be/en", notes: "Combined work and residence permit. Employer-sponsored." },
      { type: "EU Blue Card", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science","healthcare","finance"], processingWeeks: [8,16], costUSD: 200, prYears: 5, url: "https://dofi.ibz.be/en", notes: "Salary threshold ~€58,000/year gross." },
      { type: "Professional Card (Self-Employed)", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 250, prYears: 5, url: "https://dofi.ibz.be/en", notes: "For freelancers and business owners." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,16], costUSD: 200, prYears: 5, url: "https://dofi.ibz.be/en", notes: "Income threshold ~€1,900/month net." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: null, url: "https://dofi.ibz.be/en", notes: "Low tuition (~€4,000-6,000/year for non-EU)." },
    ]
  },
  {
    name: "Chile", flag: "🇨🇱", region: "Americas", englishFriendly: 2, costOfLiving: 4, healthcare: 4, safety: 4, pathToPR: 4,
    visas: [
      { type: "Work Visa (Sujeta a Contrato)", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 200, prYears: 2, url: "https://serviciomigraciones.cl/en/", notes: "Employer-sponsored. PR after 1-2 years." },
      { type: "Tech Visa (Startup Chile)", category: "work", minEducation: "none", fields: ["tech"], processingWeeks: [2,8], costUSD: 100, prYears: 2, url: "https://serviciomigraciones.cl/en/", notes: "Equity-free funding up to $100K. Very competitive." },
      { type: "Retirement Visa (Rentista)", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: 2, url: "https://serviciomigraciones.cl/en/", notes: "Need ~$1,500/month pension or investment income." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: 2, url: "https://serviciomigraciones.cl/en/", notes: "Straightforward process. Same PR timeline." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 150, prYears: null, url: "https://serviciomigraciones.cl/en/", notes: "Affordable tuition at public universities." },
    ]
  },
  {
    name: "Argentina", flag: "🇦🇷", region: "Americas", englishFriendly: 2, costOfLiving: 5, healthcare: 4, safety: 3, pathToPR: 5,
    visas: [
      { type: "Rentista (Income) Visa", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: 2, url: "https://www.argentina.gob.ar/interior/migraciones", notes: "Need ~$2,000/month passive income. Very affordable." },
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 250, prYears: null, url: "https://www.argentina.gob.ar/interior/migraciones", notes: "Must earn $1,500/month. Extremely favorable exchange rate." },
      { type: "Work Visa", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 200, prYears: 2, url: "https://www.argentina.gob.ar/interior/migraciones", notes: "Employer-sponsored. Strong labor protections." },
      { type: "Family (Marriage)", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: 2, url: "https://www.argentina.gob.ar/interior/migraciones", notes: "Marriage to Argentine citizen gives immediate temporary residency." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 150, prYears: null, url: "https://www.argentina.gob.ar/interior/migraciones", notes: "Free tuition at public universities including for foreigners." },
    ]
  },
  {
    name: "Belize", flag: "🇧🇿", region: "Americas", englishFriendly: 5, costOfLiving: 4, healthcare: 2, safety: 3, pathToPR: 5,
    visas: [
      { type: "Qualified Retired Persons (QRP)", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 250, prYears: 0, url: "https://www.immigration.gov.bz/", notes: "Age 45+. Need $2,000/month income. Tax-free foreign income." },
      { type: "Permanent Residency", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 1000, prYears: 1, url: "https://www.immigration.gov.bz/", notes: "After 1 year of continuous residence. One of the fastest PR paths." },
      { type: "Self-Employment Permit", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,8], costUSD: 300, prYears: 1, url: "https://www.immigration.gov.bz/", notes: "For small business operators. Low barrier to entry." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [2,6], costUSD: 100, prYears: null, url: "https://www.immigration.gov.bz/", notes: "English-language instruction. Very affordable." },
    ]
  },
  {
    name: "Singapore", flag: "🇸🇬", region: "Asia", englishFriendly: 5, costOfLiving: 1, healthcare: 5, safety: 5, pathToPR: 3,
    visas: [
      { type: "Employment Pass (EP)", category: "work", minEducation: "bachelors", fields: ["tech","engineering","finance","science"], processingWeeks: [2,8], costUSD: 150, prYears: 3, url: "https://www.mom.gov.sg/passes-and-permits", notes: "SGD 5,000+/month. COMPASS points framework since 2023." },
      { type: "EntrePass", category: "work", minEducation: "none", fields: ["tech","any"], processingWeeks: [4,12], costUSD: 200, prYears: 3, url: "https://www.mom.gov.sg/passes-and-permits", notes: "For startup founders with innovative business idea." },
      { type: "ONE Pass", category: "work", minEducation: "none", fields: ["tech","science","creative","finance"], processingWeeks: [2,6], costUSD: 200, prYears: 3, url: "https://www.mom.gov.sg/passes-and-permits", notes: "Top-tier pass. SGD 30,000+/month. 5-year term." },
      { type: "Dependant Pass", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 150, prYears: 3, url: "https://www.mom.gov.sg/passes-and-permits", notes: "For spouse and children of EP holders earning SGD 6,000+/month." },
      { type: "Student Pass", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [2,6], costUSD: 100, prYears: null, url: "https://www.mom.gov.sg/passes-and-permits", notes: "World-class universities. Tuition SGD 15,000-40,000/year." },
    ]
  },
  {
    name: "Philippines", flag: "🇵🇭", region: "Asia", englishFriendly: 5, costOfLiving: 5, healthcare: 3, safety: 3, pathToPR: 4,
    visas: [
      { type: "SRRV (Retirement)", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [2,8], costUSD: 1500, prYears: 0, url: "https://immigration.gov.ph/", notes: "Age 35+. Deposit $20,000-50,000. Permanent residence." },
      { type: "9(g) Work Visa", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 300, prYears: null, url: "https://immigration.gov.ph/", notes: "Employer-sponsored. 1-3 year terms, renewable." },
      { type: "SIRV (Investor)", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 400, prYears: 0, url: "https://immigration.gov.ph/", notes: "Invest $75,000 in BOI-approved activities. Permanent residence." },
      { type: "13(a) Marriage Visa", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 400, prYears: 0, url: "https://immigration.gov.ph/", notes: "For spouses of Filipino citizens. Permanent residence." },
      { type: "Student Visa (9f)", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [2,6], costUSD: 200, prYears: null, url: "https://immigration.gov.ph/", notes: "English-language instruction. Very affordable ($500-3,000/year)." },
    ]
  },
  {
    name: "Indonesia", flag: "🇮🇩", region: "Asia", englishFriendly: 2, costOfLiving: 5, healthcare: 3, safety: 4, pathToPR: 2,
    visas: [
      { type: "Digital Nomad Visa (B211A)", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [1,4], costUSD: 350, prYears: null, url: "https://www.imigrasi.go.id/en/", notes: "5-year visa. Must earn $60K+/year. No Indonesian income tax. Bali is the draw." },
      { type: "Work Permit (KITAS)", category: "work", minEducation: "bachelors", fields: ["tech","engineering","finance"], processingWeeks: [4,12], costUSD: 1200, prYears: 5, url: "https://www.imigrasi.go.id/en/", notes: "Employer-sponsored. Must have degree + 5 years experience." },
      { type: "Investor KITAS", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 1200, prYears: 5, url: "https://www.imigrasi.go.id/en/", notes: "Invest IDR 1.1B (~$70K) in Indonesian company." },
      { type: "Retirement KITAS", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 500, prYears: null, url: "https://www.imigrasi.go.id/en/", notes: "Age 55+. Must show $1,500/month pension/income." },
      { type: "Spouse KITAS", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 500, prYears: 5, url: "https://www.imigrasi.go.id/en/", notes: "For spouses of Indonesian citizens. KITAP after 5 years." },
      { type: "Student KITAS", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 400, prYears: null, url: "https://www.imigrasi.go.id/en/", notes: "Very affordable. Bahasa Indonesia programs popular." },
    ]
  },
  {
    name: "United Arab Emirates", flag: "🇦🇪", region: "Middle East & Africa", englishFriendly: 5, costOfLiving: 3, healthcare: 4, safety: 5, pathToPR: 3,
    visas: [
      { type: "Golden Visa (10-Year)", category: "work", minEducation: "none", fields: ["tech","science","creative","finance"], processingWeeks: [2,6], costUSD: 800, prYears: null, url: "https://icp.gov.ae/en/", notes: "10-year renewable. For investors ($545K+), entrepreneurs, specialized talent." },
      { type: "Green Visa (Self-Sponsored)", category: "work", minEducation: "bachelors", fields: ["any"], processingWeeks: [2,6], costUSD: 600, prYears: null, url: "https://icp.gov.ae/en/", notes: "5-year self-sponsored visa. AED 15,000+/month salary." },
      { type: "Freelance Permit", category: "remote", minEducation: "none", fields: ["tech","creative","consulting"], processingWeeks: [1,4], costUSD: 1500, prYears: null, url: "https://icp.gov.ae/en/", notes: "Through free zone authorities. 0% income tax." },
      { type: "Remote Work Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [1,3], costUSD: 600, prYears: null, url: "https://icp.gov.ae/en/", notes: "Must earn $3,500/month. 0% income tax." },
      { type: "Investor Visa", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [2,8], costUSD: 1000, prYears: null, url: "https://icp.gov.ae/en/", notes: "Free zone company formation from ~$5,000. 100% foreign ownership." },
      { type: "Family Visa", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [2,4], costUSD: 500, prYears: null, url: "https://icp.gov.ae/en/", notes: "Sponsor with AED 4,000+/month income." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [2,4], costUSD: 400, prYears: null, url: "https://icp.gov.ae/en/", notes: "Many international university branches. English-taught." },
    ]
  },
  {
    name: "South Africa", flag: "🇿🇦", region: "Middle East & Africa", englishFriendly: 5, costOfLiving: 5, healthcare: 3, safety: 2, pathToPR: 3,
    visas: [
      { type: "Critical Skills Work Visa", category: "work", minEducation: "bachelors", fields: ["tech","engineering","healthcare","science","finance"], processingWeeks: [8,24], costUSD: 100, prYears: 5, url: "https://www.dha.gov.za/index.php/immigration-services", notes: "For occupations on critical skills list. No job offer needed." },
      { type: "General Work Visa", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [8,30], costUSD: 100, prYears: 5, url: "https://www.dha.gov.za/index.php/immigration-services", notes: "Employer-sponsored. Labour certification required." },
      { type: "Business Visa", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 150, prYears: 5, url: "https://www.dha.gov.za/index.php/immigration-services", notes: "Invest ZAR 5M (~$275K) in South African business." },
      { type: "Retired Person Visa", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 100, prYears: 5, url: "https://www.dha.gov.za/index.php/immigration-services", notes: "Need ZAR 37,000/month (~$2,000). Affordable lifestyle." },
      { type: "Spousal Visa", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 100, prYears: 2, url: "https://www.dha.gov.za/index.php/immigration-services", notes: "Can work immediately. PR eligible after 2 years." },
      { type: "Study Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [8,16], costUSD: 100, prYears: null, url: "https://www.dha.gov.za/index.php/immigration-services", notes: "English instruction. World-class universities." },
    ]
  },
  {
    name: "Fiji", flag: "🇫🇯", region: "Oceania", englishFriendly: 5, costOfLiving: 4, healthcare: 2, safety: 4, pathToPR: 4,
    visas: [
      { type: "Retired Person Permit", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: 3, url: "https://www.immigration.gov.fj/", notes: "Need FJD 100,000 (~$45K) annual income." },
      { type: "Work Permit", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: 5, url: "https://www.immigration.gov.fj/", notes: "Employer-sponsored. IT, healthcare, engineering in demand." },
      { type: "Investor Permit", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 250, prYears: 3, url: "https://www.immigration.gov.fj/", notes: "Invest FJD 250,000+ (~$112K). Must create local employment." },
      { type: "Student Permit", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [2,6], costUSD: 150, prYears: null, url: "https://www.immigration.gov.fj/", notes: "English instruction. University of the South Pacific." },
    ]
  },
  {
    name: "Malta", flag: "🇲🇹", region: "Europe", englishFriendly: 5, costOfLiving: 3, healthcare: 4, safety: 5, pathToPR: 4,
    visas: [
      { type: "Single Permit (Work)", category: "work", minEducation: "none", fields: ["tech","finance","engineering","science"], processingWeeks: [4,12], costUSD: 300, prYears: 5, url: "https://www.identitymalta.com/unit/central-visa-unit/", notes: "Employer-sponsored. Strong iGaming and fintech sectors." },
      { type: "Key Employee Initiative", category: "work", minEducation: "bachelors", fields: ["tech","finance","engineering"], processingWeeks: [1,3], costUSD: 300, prYears: 5, url: "https://www.identitymalta.com/unit/central-visa-unit/", notes: "Fast-track 5-day processing. €30,000+ salary." },
      { type: "Nomad Residence Permit", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 400, prYears: null, url: "https://www.identitymalta.com/unit/central-visa-unit/", notes: "Must earn €2,700/month from remote work." },
      { type: "Global Residence Programme", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 6000, prYears: null, url: "https://www.identitymalta.com/unit/central-visa-unit/", notes: "15% flat rate on foreign income remitted to Malta." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 300, prYears: 5, url: "https://www.identitymalta.com/unit/central-visa-unit/", notes: "For spouse and dependents of legal residents." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 250, prYears: null, url: "https://www.identitymalta.com/unit/central-visa-unit/", notes: "English-taught programs. Popular language school destination." },
    ]
  },
  {
    name: "Poland", flag: "🇵🇱", region: "Europe", englishFriendly: 3, costOfLiving: 4, healthcare: 3, safety: 5, pathToPR: 4,
    visas: [
      { type: "Work Permit (Type A)", category: "work", minEducation: "none", fields: ["tech","engineering","finance","science"], processingWeeks: [4,16], costUSD: 50, prYears: 5, url: "https://www.gov.pl/web/udsc-en", notes: "Employer-sponsored. Warsaw and Kraków tech hubs." },
      { type: "EU Blue Card", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science","healthcare","finance"], processingWeeks: [4,12], costUSD: 50, prYears: 5, url: "https://www.gov.pl/web/udsc-en", notes: "Salary threshold ~PLN 8,500/month gross." },
      { type: "Business Visa (Self-Employment)", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 50, prYears: 5, url: "https://www.gov.pl/web/udsc-en", notes: "Register sp. z o.o. (LLC) with PLN 5,000 (~$1,250)." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 50, prYears: 5, url: "https://www.gov.pl/web/udsc-en", notes: "Standard EU framework." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 50, prYears: null, url: "https://www.gov.pl/web/udsc-en", notes: "Very affordable (~€2,000-5,000/year for English programs)." },
    ]
  },
  {
    name: "Norway", flag: "🇳🇴", region: "Europe", englishFriendly: 5, costOfLiving: 2, healthcare: 5, safety: 5, pathToPR: 4,
    visas: [
      { type: "Skilled Worker Permit", category: "work", minEducation: "bachelors", fields: ["tech","engineering","healthcare","science","finance"], processingWeeks: [4,16], costUSD: 650, prYears: 3, url: "https://www.udi.no/en/", notes: "Must have concrete job offer. Fastest PR path in Europe (3 years)." },
      { type: "Self-Employment Permit", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 650, prYears: 3, url: "https://www.udi.no/en/", notes: "Business must be profitable and meet real demand." },
      { type: "Family Immigration", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 650, prYears: 3, url: "https://www.udi.no/en/", notes: "Income requirement ~NOK 317,200/year." },
      { type: "Student Permit", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 650, prYears: null, url: "https://www.udi.no/en/", notes: "Tuition-free even for non-EU. Must show ~NOK 137,907/year." },
    ]
  },
  {
    name: "Brazil", flag: "🇧🇷", region: "Americas", englishFriendly: 2, costOfLiving: 4, healthcare: 3, safety: 3, pathToPR: 4,
    visas: [
      { type: "Digital Nomad Visa", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,8], costUSD: 200, prYears: null, url: "https://www.gov.br/mre/en/subjects/consular-services-and-visas/visas", notes: "Must earn $1,500/month from foreign sources. 1-year visa." },
      { type: "Work Visa (VITEM V)", category: "work", minEducation: "bachelors", fields: ["tech","engineering","science","finance"], processingWeeks: [8,24], costUSD: 300, prYears: 4, url: "https://www.gov.br/mre/en/subjects/consular-services-and-visas/visas", notes: "Employer-sponsored. PR possible after 4 years." },
      { type: "Investor Visa", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 300, prYears: 4, url: "https://www.gov.br/mre/en/subjects/consular-services-and-visas/visas", notes: "Invest BRL 500,000 (~$100K) in productive activity." },
      { type: "Retirement Visa", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 250, prYears: 0, url: "https://www.gov.br/mre/en/subjects/consular-services-and-visas/visas", notes: "Need $2,000/month pension. Grants permanent residency directly." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 250, prYears: 0, url: "https://www.gov.br/mre/en/subjects/consular-services-and-visas/visas", notes: "Marriage to Brazilian citizen grants immediate PR." },
      { type: "Student Visa (VITEM IV)", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: null, url: "https://www.gov.br/mre/en/subjects/consular-services-and-visas/visas", notes: "Public universities are free." },
    ]
  },
  {
    name: "Dominican Republic", flag: "🇩🇴", region: "Americas", englishFriendly: 3, costOfLiving: 5, healthcare: 3, safety: 3, pathToPR: 4,
    visas: [
      { type: "Residency (Rentista)", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 400, prYears: 2, url: "https://www.dgm.gob.do/", notes: "Need $1,500/month income. Affordable Caribbean lifestyle." },
      { type: "Residency (Inversionista)", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 400, prYears: 2, url: "https://www.dgm.gob.do/", notes: "Invest $200,000+ in approved business or real estate." },
      { type: "Work Residency", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 400, prYears: 2, url: "https://www.dgm.gob.do/", notes: "Employer-sponsored. 80% Dominican workforce ratio." },
      { type: "Family Dependent", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [8,20], costUSD: 400, prYears: 2, url: "https://www.dgm.gob.do/", notes: "For spouse and children of residents." },
      { type: "Student Residency", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,12], costUSD: 300, prYears: null, url: "https://www.dgm.gob.do/", notes: "Very affordable. Growing medical school options." },
    ]
  },
  {
    name: "Cambodia", flag: "🇰🇭", region: "Asia", englishFriendly: 3, costOfLiving: 5, healthcare: 2, safety: 3, pathToPR: 2,
    visas: [
      { type: "Ordinary Visa (E-Class Business)", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [0,1], costUSD: 40, prYears: null, url: "https://www.immigration.gov.kh/", notes: "Available on arrival. Renewable indefinitely. Work permit add-on ~$100/year." },
      { type: "Retirement (Long-Stay ER)", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [1,4], costUSD: 300, prYears: null, url: "https://www.immigration.gov.kh/", notes: "Age 55+. Very affordable ($800-1,200/month lifestyle)." },
      { type: "Business Registration", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 500, prYears: null, url: "https://www.immigration.gov.kh/", notes: "100% foreign ownership. Register company for ~$1,000-2,000." },
      { type: "Student Visa", category: "study", minEducation: "none", fields: ["any"], processingWeeks: [1,2], costUSD: 40, prYears: null, url: "https://www.immigration.gov.kh/", notes: "Extremely affordable. Easy to obtain." },
    ]
  },
  {
    name: "Paraguay", flag: "🇵🇾", region: "Americas", englishFriendly: 1, costOfLiving: 5, healthcare: 2, safety: 3, pathToPR: 5,
    visas: [
      { type: "Permanent Residency", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 500, prYears: 0, url: "https://www.migraciones.gov.py/", notes: "One of the easiest PR programs. Deposit ~$5,500 in bank." },
      { type: "SUACE Business Visa", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [2,8], costUSD: 300, prYears: 0, url: "https://www.migraciones.gov.py/", notes: "Register company in days. 10% flat tax." },
      { type: "Rentista", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 500, prYears: 0, url: "https://www.migraciones.gov.py/", notes: "Need ~$1,300/month. Territorial tax — foreign income not taxed." },
      { type: "Family Reunification", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 500, prYears: 0, url: "https://www.migraciones.gov.py/", notes: "Dependents included in same PR application." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 200, prYears: null, url: "https://www.migraciones.gov.py/", notes: "Very affordable. Programs primarily in Spanish." },
    ]
  },
  {
    name: "Qatar", flag: "🇶🇦", region: "Middle East & Africa", englishFriendly: 4, costOfLiving: 2, healthcare: 4, safety: 5, pathToPR: 2,
    visas: [
      { type: "Work Visa", category: "work", minEducation: "none", fields: ["tech","engineering","finance","healthcare","science"], processingWeeks: [4,12], costUSD: 300, prYears: null, url: "https://portal.moi.gov.qa/wps/portal/MOIInternet/departmentcommittees/immigration/", notes: "Employer-sponsored. No income tax." },
      { type: "Freelance Visa", category: "remote", minEducation: "none", fields: ["tech","creative","consulting"], processingWeeks: [2,6], costUSD: 500, prYears: null, url: "https://portal.moi.gov.qa/wps/portal/MOIInternet/departmentcommittees/immigration/", notes: "For independent professionals. 0% income tax." },
      { type: "Permanent Residency Card", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [8,24], costUSD: 500, prYears: null, url: "https://portal.moi.gov.qa/wps/portal/MOIInternet/departmentcommittees/immigration/", notes: "Rare Gulf PR. QAR 2M+ (~$550K) in real estate." },
      { type: "Family Visa", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [2,8], costUSD: 300, prYears: null, url: "https://portal.moi.gov.qa/wps/portal/MOIInternet/departmentcommittees/immigration/", notes: "Sponsor with QAR 10,000+/month income." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 200, prYears: null, url: "https://portal.moi.gov.qa/wps/portal/MOIInternet/departmentcommittees/immigration/", notes: "Education City hosts Georgetown, Northwestern, UCL branches." },
    ]
  },
  {
    name: "Morocco", flag: "🇲🇦", region: "Middle East & Africa", englishFriendly: 2, costOfLiving: 5, healthcare: 3, safety: 4, pathToPR: 3,
    visas: [
      { type: "Digital Nomad (Long-Stay)", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,8], costUSD: 100, prYears: null, url: "https://www.service-public.ma/", notes: "90-day visa-free plus renewable residence cards. Very affordable." },
      { type: "Work Permit (Carte de Séjour)", category: "work", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 100, prYears: 5, url: "https://www.service-public.ma/", notes: "Employer-sponsored via ANAPEC. 1-year renewable." },
      { type: "Business/Investor", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 150, prYears: 5, url: "https://www.service-public.ma/", notes: "SARL (LLC) with ~$1,000 capital. CFC Casablanca offers 0% tax." },
      { type: "Retirement Residence", category: "retirement", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 100, prYears: 5, url: "https://www.service-public.ma/", notes: "Need ~$1,000/month pension. Close to Europe." },
      { type: "Student Visa", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 100, prYears: null, url: "https://www.service-public.ma/", notes: "Programs in French and Arabic. Growing English options." },
    ]
  },
  {
    name: "Kenya", flag: "🇰🇪", region: "Middle East & Africa", englishFriendly: 5, costOfLiving: 5, healthcare: 3, safety: 3, pathToPR: 3,
    visas: [
      { type: "Work Permit (Class D)", category: "work", minEducation: "none", fields: ["tech","engineering","finance","science"], processingWeeks: [4,16], costUSD: 200, prYears: 7, url: "https://fns.immigration.go.ke/", notes: "Nairobi is a major African tech hub. 2-year permits." },
      { type: "Business Permit (Class G)", category: "investor", minEducation: "none", fields: ["any"], processingWeeks: [4,16], costUSD: 200, prYears: 7, url: "https://fns.immigration.go.ke/", notes: "Must invest ~$100,000 minimum. Growing startup ecosystem." },
      { type: "Digital Nomad (Remote Work Permit)", category: "remote", minEducation: "none", fields: ["any"], processingWeeks: [2,6], costUSD: 250, prYears: null, url: "https://fns.immigration.go.ke/", notes: "Strong infrastructure and coworking scene in Nairobi." },
      { type: "Dependent Pass", category: "family", minEducation: "none", fields: ["any"], processingWeeks: [4,12], costUSD: 200, prYears: 7, url: "https://fns.immigration.go.ke/", notes: "For spouse and children of permit holders." },
      { type: "Student Permit", category: "study", minEducation: "highschool", fields: ["any"], processingWeeks: [4,8], costUSD: 150, prYears: null, url: "https://fns.immigration.go.ke/", notes: "English instruction. Very affordable ($1,000-5,000/year)." },
    ]
  },
];

const CATEGORIES = [
  { id: "work", label: "Employment", icon: "💼" },
  { id: "remote", label: "Remote / Digital Nomad", icon: "🌐" },
  { id: "retirement", label: "Retirement / Passive Income", icon: "🏖️" },
  { id: "study", label: "Study", icon: "🎓" },
  { id: "investor", label: "Investor", icon: "💰" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
];

const FIELDS = [
  { id: "tech", label: "Technology / IT" },
  { id: "engineering", label: "Engineering" },
  { id: "healthcare", label: "Healthcare" },
  { id: "science", label: "Science / Research" },
  { id: "finance", label: "Finance / Business" },
  { id: "creative", label: "Creative / Arts" },
  { id: "consulting", label: "Consulting" },
  { id: "any", label: "Other / General" },
];

const EDUCATION_LEVELS = [
  { id: "none", label: "No degree", rank: 0 },
  { id: "highschool", label: "High school", rank: 1 },
  { id: "bachelors", label: "Bachelor's degree", rank: 2 },
  { id: "masters", label: "Master's or higher", rank: 3 },
];

const REGIONS = ["All", "Europe", "Americas", "Asia", "Oceania", "Middle East & Africa"];

const ratingText = (n) => `${n} out of 5`;
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

export default function MyWiseRelocate() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    categories: [], education: "bachelors", field: "tech", hasFamily: false, region: "All",
    priorities: { costOfLiving: 3, healthcare: 3, safety: 3, englishFriendly: 3, pathToPR: 3 },
  });
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [expandedVisa, setExpandedVisa] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const stepHeadingRef = useRef(null);

  useEffect(() => {
    setAnimateIn(true);
    if (stepHeadingRef.current) stepHeadingRef.current.focus();
  }, [step]);

  const educationRank = EDUCATION_LEVELS.find(e => e.id === profile.education)?.rank || 0;

  const results = useMemo(() => {
    if (step < 4) return [];
    return COUNTRIES
      .filter(c => profile.region === "All" || c.region === profile.region)
      .map(country => {
        const matchingVisas = country.visas.filter(v => {
          const catMatch = profile.categories.length === 0 || profile.categories.includes(v.category);
          const eduReq = EDUCATION_LEVELS.find(e => e.id === v.minEducation)?.rank || 0;
          return catMatch && educationRank >= eduReq && (v.fields.includes("any") || v.fields.includes(profile.field));
        });
        if (matchingVisas.length === 0) return null;
        const p = profile.priorities;
        const weights = {costOfLiving: p.costOfLiving, healthcare: p.healthcare, safety: p.safety, englishFriendly: p.englishFriendly, pathToPR: p.pathToPR};
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        const weightedScore = (country.costOfLiving / 5) * weights.costOfLiving +
          (country.healthcare / 5) * weights.healthcare + (country.safety / 5) * weights.safety +
          (country.englishFriendly / 5) * weights.englishFriendly + (country.pathToPR / 5) * weights.pathToPR;
        const score = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;
        return { ...country, matchingVisas, score };
      }).filter(Boolean).sort((a, b) => b.score - a.score);
  }, [step, profile, educationRank]);

  const toggleCategory = (id) => setProfile(p => ({ ...p, categories: p.categories.includes(id) ? p.categories.filter(c => c !== id) : [...p.categories, id] }));
  const toggleCompare = (name) => setCompareList(prev => prev.includes(name) ? prev.filter(n => n !== name) : prev.length < 3 ? [...prev, name] : prev);
  const changeStep = (n) => { setAnimateIn(false); setTimeout(() => setStep(n), 150); };
  const compareData = results.filter(r => compareList.includes(r.name));


  const totalVisas = COUNTRIES.reduce((sum, c) => sum + c.visas.length, 0);

  const renderLanding = () => (
    <div role="region" aria-label="Welcome">
      <div style={S.hero}>
        <div style={S.heroInner}>
          <p style={S.heroEyebrow}>VISA PATHWAY FINDER FOR US CITIZENS</p>
          <h2 style={S.heroTitle} ref={stepHeadingRef} tabIndex={-1}>Find your path to a new home abroad</h2>
          <p style={S.heroDesc}>Discover which countries match your goals, compare visa options side by side, and connect directly with official government immigration portals — all in one place.</p>
          <button style={S.heroCta} onClick={() => changeStep(1)}>Start exploring</button>
        </div>
      </div>

      <div style={S.statsBar} role="region" aria-label="Tool coverage">
        <div style={S.statItem}><span style={S.statNumber}>{COUNTRIES.length}</span><span style={S.statLabel}>Countries</span></div>
        <div style={S.statDivider} aria-hidden="true" />
        <div style={S.statItem}><span style={S.statNumber}>{totalVisas}+</span><span style={S.statLabel}>Visa Pathways</span></div>
        <div style={S.statDivider} aria-hidden="true" />
        <div style={S.statItem}><span style={S.statNumber}>6</span><span style={S.statLabel}>Regions</span></div>
        <div style={S.statDivider} aria-hidden="true" />
        <div style={S.statItem}><span style={S.statNumber}>100%</span><span style={S.statLabel}>Free to Use</span></div>
      </div>

      <div style={S.landingSection}>
        <h3 style={S.sectionTitle}>HOW IT WORKS</h3>
        <div style={S.stepsGrid}>
          <div style={S.stepCard}>
            <div style={S.stepCardNumber} aria-hidden="true">1</div>
            <h4 style={S.stepCardTitle}>Tell us your goals</h4>
            <p style={S.stepCardDesc}>Select the visa types that interest you, share your professional background, and rate what matters most — affordability, safety, healthcare, or path to residency.</p>
          </div>
          <div style={S.stepCard}>
            <div style={S.stepCardNumber} aria-hidden="true">2</div>
            <h4 style={S.stepCardTitle}>Get matched</h4>
            <p style={S.stepCardDesc}>Our weighted matching algorithm scores every country against your priorities and filters visa options based on your education, field, and family situation.</p>
          </div>
          <div style={S.stepCard}>
            <div style={S.stepCardNumber} aria-hidden="true">3</div>
            <h4 style={S.stepCardTitle}>Research and take action</h4>
            <p style={S.stepCardDesc}>Compare countries side by side, explore detailed visa requirements with processing times and costs, and link directly to official government immigration portals.</p>
          </div>
        </div>
      </div>

      <div style={S.landingSection}>
        <h3 style={S.sectionTitle}>WHAT YOU GET</h3>
        <div style={S.featuresGrid}>
          <div style={S.featureCard}>
            <span style={S.featureIcon} aria-hidden="true">🎯</span>
            <h4 style={S.featureTitle}>Personalized matching</h4>
            <p style={S.featureDesc}>Results weighted to your priorities, not a generic list. Adjust what matters and watch your matches change in real time.</p>
          </div>
          <div style={S.featureCard}>
            <span style={S.featureIcon} aria-hidden="true">📋</span>
            <h4 style={S.featureTitle}>Real visa data</h4>
            <p style={S.featureDesc}>Processing times, application costs, education requirements, and estimated years to permanent residency for every pathway.</p>
          </div>
          <div style={S.featureCard}>
            <span style={S.featureIcon} aria-hidden="true">🏛️</span>
            <h4 style={S.featureTitle}>Official government links</h4>
            <p style={S.featureDesc}>Every visa option links directly to the relevant national immigration agency so you can verify details and begin your application.</p>
          </div>
          <div style={S.featureCard}>
            <span style={S.featureIcon} aria-hidden="true">⚖️</span>
            <h4 style={S.featureTitle}>Side-by-side comparison</h4>
            <p style={S.featureDesc}>Select up to three countries and compare them across affordability, healthcare, safety, English-friendliness, and path to residency.</p>
          </div>
        </div>
      </div>

      <div style={S.landingCta}>
        <p style={S.landingCtaText}>Ready to discover where you belong?</p>
        <button style={S.heroCta} onClick={() => changeStep(1)}>Start your search</button>
      </div>
    </div>
  );

  const renderStep0 = () => (
    <div role="region" aria-label="Step 1: Visa type selection">
      <h2 style={S.stepTitle} ref={stepHeadingRef} tabIndex={-1}>What type of visa are you looking for?</h2>
      <p style={S.stepSub} id="step0-desc">Select all that interest you, or skip to see everything.</p>
      <div style={S.catGrid} role="group" aria-labelledby="step0-desc">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => toggleCategory(cat.id)} aria-pressed={profile.categories.includes(cat.id)}
            style={{ ...S.catCard, ...(profile.categories.includes(cat.id) ? S.catCardActive : {}) }}>
            <span aria-hidden="true" style={S.catIcon}>{cat.icon}</span>
            <span style={S.catLabel}>{cat.label}</span>
          </button>
        ))}
      </div>
      <div style={S.navRow}><div />
        <button style={S.btnPrimary} onClick={() => changeStep(2)}>{profile.categories.length === 0 ? "Show all visa types" : "Next step"}</button>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div role="region" aria-label="Step 2: Your profile">
      <h2 style={S.stepTitle} ref={stepHeadingRef} tabIndex={-1}>Tell us about yourself</h2>
      <p style={S.stepSub}>This helps us match you with visas you're likely eligible for.</p>
      <fieldset style={S.fieldset}><legend style={S.label}>Highest education level</legend>
        <div role="radiogroup" aria-label="Education level" style={S.radioGroup}>
          {EDUCATION_LEVELS.map(ed => <button key={ed.id} role="radio" aria-checked={profile.education === ed.id} onClick={() => setProfile(p => ({ ...p, education: ed.id }))} style={{ ...S.radioBtn, ...(profile.education === ed.id ? S.radioBtnActive : {}) }}>{ed.label}</button>)}
        </div>
      </fieldset>
      <fieldset style={S.fieldset}><legend style={S.label}>Primary professional field</legend>
        <div role="radiogroup" aria-label="Professional field" style={S.radioGroup}>
          {FIELDS.map(f => <button key={f.id} role="radio" aria-checked={profile.field === f.id} onClick={() => setProfile(p => ({ ...p, field: f.id }))} style={{ ...S.radioBtn, ...(profile.field === f.id ? S.radioBtnActive : {}) }}>{f.label}</button>)}
        </div>
      </fieldset>
      <fieldset style={S.fieldset}><legend style={S.label}>Are you relocating with family?</legend>
        <div role="radiogroup" aria-label="Relocating with family" style={S.radioGroup}>
          <button role="radio" aria-checked={!profile.hasFamily} onClick={() => setProfile(p => ({ ...p, hasFamily: false }))} style={{ ...S.radioBtn, ...(!profile.hasFamily ? S.radioBtnActive : {}) }}>Solo</button>
          <button role="radio" aria-checked={profile.hasFamily} onClick={() => setProfile(p => ({ ...p, hasFamily: true }))} style={{ ...S.radioBtn, ...(profile.hasFamily ? S.radioBtnActive : {}) }}>With family</button>
        </div>
      </fieldset>
      <div style={S.navRow}>
        <button style={S.btnSecondary} onClick={() => changeStep(1)}>Back</button>
        <button style={S.btnPrimary} onClick={() => changeStep(3)}>Next step</button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div role="region" aria-label="Step 3: Your priorities">
      <h2 style={S.stepTitle} ref={stepHeadingRef} tabIndex={-1}>What matters most to you?</h2>
      <p style={S.stepSub}>Rate the importance of each factor (1 = not important, 5 = critical).</p>
      <fieldset style={S.fieldset}><legend style={S.label}>Preferred region</legend>
        <div role="radiogroup" aria-label="Preferred region" style={S.radioGroup}>
          {REGIONS.map(r => <button key={r} role="radio" aria-checked={profile.region === r} onClick={() => setProfile(p => ({ ...p, region: r }))} style={{ ...S.radioBtn, ...(profile.region === r ? S.radioBtnActive : {}) }}>{r}</button>)}
        </div>
      </fieldset>
      {[{key:"costOfLiving",label:"Affordability"},{key:"healthcare",label:"Healthcare quality"},{key:"safety",label:"Safety"},{key:"englishFriendly",label:"English-friendliness"},{key:"pathToPR",label:"Path to permanent residency"}].map(({key,label}) => (
        <div key={key} style={S.sliderRow}>
          <label htmlFor={`slider-${key}`} style={S.sliderLabel}>{label}</label>
          <input id={`slider-${key}`} type="range" min={1} max={5} value={profile.priorities[key]}
            aria-label={`${label}: ${profile.priorities[key]} out of 5`}
            onChange={e => setProfile(p => ({...p, priorities: {...p.priorities, [key]: Number(e.target.value)}}))} style={S.slider} />
          <span aria-hidden="true" style={S.sliderValue}>{profile.priorities[key]}/5</span>
        </div>
      ))}
      <div style={S.navRow}>
        <button style={S.btnSecondary} onClick={() => changeStep(2)}>Back</button>
        <button style={S.btnPrimary} onClick={() => changeStep(4)}>See results</button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div role="region" aria-label="Results">
      <div style={S.resultsHeader}>
        <div>
          <h2 style={S.stepTitle} ref={stepHeadingRef} tabIndex={-1}>Your relocation matches</h2>
          <p style={S.stepSub} role="status" aria-live="polite">{results.length} countries with {results.reduce((s,r) => s + r.matchingVisas.length, 0)} matching visa pathways</p>
        </div>
        <div style={S.resultsActions}>
          {compareList.length >= 2 && <button style={S.btnCompare} onClick={() => setShowCompare(!showCompare)} aria-expanded={showCompare}>{showCompare ? "Hide comparison" : `Compare (${compareList.length})`}</button>}
          <button style={S.btnSecondary} onClick={() => {setStep(0);setExpandedCountry(null);setExpandedVisa(null);setCompareList([]);setShowCompare(false);}}>Start over</button>
        </div>
      </div>
      {showCompare && compareData.length >= 2 && (
        <div style={S.compareTable} role="region" aria-label="Country comparison">
          <table style={S.table}>
            <caption className="sr-only">Side-by-side comparison of selected countries</caption>
            <thead><tr><th scope="col" style={S.th}>Factor</th>{compareData.map(c => <th key={c.name} scope="col" style={S.th}>{c.flag} {c.name}</th>)}</tr></thead>
            <tbody>
              {[{key:"score",label:"Match score"},{key:"costOfLiving",label:"Affordability"},{key:"healthcare",label:"Healthcare"},{key:"safety",label:"Safety"},{key:"englishFriendly",label:"English-friendly"},{key:"pathToPR",label:"Path to PR"}].map(({key,label}) => (
                <tr key={key}><th scope="row" style={S.td}>{label}</th>
                  {compareData.map(c => <td key={c.name} style={S.td}>{key === "score" ? <span>{c.score}% match</span> : <span aria-label={`${label}: ${ratingText(c[key])}`}>{stars(c[key])}</span>}</td>)}
                </tr>
              ))}
              <tr><th scope="row" style={S.td}>Matching visas</th>{compareData.map(c => <td key={c.name} style={S.td}>{c.matchingVisas.length}</td>)}</tr>
            </tbody>
          </table>
        </div>
      )}
      <div role="list" aria-label="Country results" style={S.resultsList}>
        {results.map((country, idx) => {
          const isExp = expandedCountry === country.name;
          const cid = `country-${country.name.replace(/\s+/g,"-")}`;
          const pid = `panel-${country.name.replace(/\s+/g,"-")}`;
          return (
            <div key={country.name} role="listitem" style={{...S.countryCard, animationDelay:`${idx*60}ms`}}>
              <div style={S.countryHeaderRow}>
                <label style={S.checkboxLabel}>
                  <input type="checkbox" checked={compareList.includes(country.name)} onChange={() => toggleCompare(country.name)} style={S.checkbox} aria-label={`Add ${country.name} to comparison`} />
                </label>
                <button id={cid} aria-expanded={isExp} aria-controls={pid} onClick={() => setExpandedCountry(isExp ? null : country.name)} style={S.countryHeader}>
                  <div style={S.countryLeft}>
                    <span aria-hidden="true" style={S.flag}>{country.flag}</span>
                    <div><span style={S.countryName}>{country.name}</span><span style={S.countryMeta}>{country.region} · {country.matchingVisas.length} visa{country.matchingVisas.length !== 1 ? "s" : ""} match</span></div>
                  </div>
                  <div style={S.countryRight}>
                    <span style={S.scoreBadge} aria-label={`Match score: ${country.score}%`}>{country.score}%</span>
                    <span aria-hidden="true" style={S.expandArrow}>{isExp ? "▾" : "▸"}</span>
                  </div>
                </button>
              </div>
              {isExp && (
                <div id={pid} role="region" aria-labelledby={cid} style={S.countryBody}>
                  <div style={S.factorRow}>
                    {[{key:"costOfLiving",label:"Affordability"},{key:"healthcare",label:"Healthcare"},{key:"safety",label:"Safety"},{key:"englishFriendly",label:"English"},{key:"pathToPR",label:"PR Path"}].map(({key,label}) => (
                      <div key={key} style={S.factorChip}><div style={S.factorLabel}>{label}</div><div style={S.factorStars} aria-label={`${label}: ${ratingText(country[key])}`}>{stars(country[key])}</div></div>
                    ))}
                  </div>
                  <h3 className="sr-only">Matching visa pathways for {country.name}</h3>
                  <div style={S.visaList}>
                    {country.matchingVisas.map((visa, vi) => {
                      const vk = `${country.name}-${vi}`, vid = `visa-${cid}-${vi}`, vpid = `vpanel-${cid}-${vi}`;
                      const vExp = expandedVisa === vk;
                      return (
                        <div key={vi} style={S.visaCard}>
                          <button id={vid} aria-expanded={vExp} aria-controls={vpid} onClick={() => setExpandedVisa(vExp ? null : vk)} style={S.visaHeader}>
                            <div style={{textAlign:"left"}}><span style={S.visaType}>{visa.type}</span><span style={S.visaCat}><span aria-hidden="true">{CATEGORIES.find(c=>c.id===visa.category)?.icon} </span>{CATEGORIES.find(c=>c.id===visa.category)?.label}</span></div>
                            <span aria-hidden="true" style={S.expandArrow}>{vExp ? "▾" : "▸"}</span>
                          </button>
                          {vExp && (
                            <div id={vpid} role="region" aria-labelledby={vid} style={S.visaBody}>
                              <p style={S.visaNotes}>{visa.notes}</p>
                              <dl style={S.visaDetails}>
                                <div style={S.visaDetail}><dt style={S.detailLabel}>Processing</dt><dd style={S.detailValue}>{visa.processingWeeks[0]}-{visa.processingWeeks[1]} weeks</dd></div>
                                <div style={S.visaDetail}><dt style={S.detailLabel}>Visa cost</dt><dd style={S.detailValue}>{visa.costUSD === 0 ? "Free (US)" : `~$${visa.costUSD}`}</dd></div>
                                <div style={S.visaDetail}><dt style={S.detailLabel}>Min education</dt><dd style={S.detailValue}>{EDUCATION_LEVELS.find(e=>e.id===visa.minEducation)?.label}</dd></div>
                                <div style={S.visaDetail}><dt style={S.detailLabel}>Years to PR</dt><dd style={S.detailValue}>{visa.prYears === null ? "N/A" : visa.prYears === 0 ? "Immediate" : `~${visa.prYears} years`}</dd></div>
                              </dl>
                              {visa.url && <a href={visa.url} target="_blank" rel="noopener noreferrer" style={S.visaLink}>Official government info →</a>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <style>{`
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
        a:focus-visible,button:focus-visible,input:focus-visible,[tabindex]:focus-visible { outline:3px solid #8B6D2E; outline-offset:2px; }
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important;}}
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        input[type="range"]{-webkit-appearance:none;appearance:none;height:6px;border-radius:3px;background:#d4cfc5;outline:none;}
        input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:50%;background:#8B6D2E;cursor:pointer;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2);}
        input[type="range"]:focus-visible::-webkit-slider-thumb{outline:3px solid #8B6D2E;outline-offset:2px;}
        fieldset{border:none;padding:0;margin:0;}
      `}</style>
      <a href="#main-content" style={S.skipLink}>Skip to main content</a>
      <header style={S.header} role="banner">
        <div style={S.headerInner}>
          <div role="button" tabIndex={0} onClick={() => {setStep(0);setExpandedCountry(null);setExpandedVisa(null);setCompareList([]);setShowCompare(false);}} onKeyDown={(e) => {if(e.key==="Enter"||e.key===" "){e.preventDefault();setStep(0);setExpandedCountry(null);setExpandedVisa(null);setCompareList([]);setShowCompare(false);}}} aria-label="Return to home page" style={{...S.logoArea,cursor:"pointer"}}>
            <svg aria-hidden="true" width="32" height="32" viewBox="0 0 30 30" fill="none" style={{flexShrink:0}}>
              <circle cx="15" cy="15" r="13" stroke="#8B6D2E" strokeWidth="1.2"/>
              <circle cx="15" cy="15" r="3.5" fill="#8B6D2E"/>
              <path d="M15 4 L17.2 13 L15 11 L12.8 13 Z" fill="#8B6D2E"/>
              <path d="M26 15 L17 17.2 L19 15 L17 12.8 Z" fill="#8B6D2E"/>
              <path d="M15 26 L12.8 17 L15 19 L17.2 17 Z" fill="#8B6D2E"/>
              <path d="M4 15 L13 12.8 L11 15 L13 17.2 Z" fill="#8B6D2E"/>
            </svg>
            <div><h1 style={S.logoTitle}>MY WISE RELOCATION</h1><p style={S.logoSub}>Visa Pathway Finder for US Citizens</p></div>
          </div>
          {step >= 1 && step < 4 && (
            <nav aria-label="Progress" style={S.stepper}>
              <ol style={{display:"flex",gap:24,listStyle:"none",margin:0,padding:0}}>
                {["Visa type","Profile","Priorities"].map((s,i) => (
                  <li key={i} style={{...S.stepDot,...(i<=step-1?S.stepDotActive:{})}} aria-current={i===step-1?"step":undefined}>
                    <div aria-hidden="true" style={{...S.dot,...(i<=step-1?S.dotActive:{})}}>{i+1}</div>
                    <span style={S.stepLabelText}><span className="sr-only">{i<step-1?"Completed: ":i===step-1?"Current: ":"Upcoming: "}</span>{s}</span>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>
      </header>
      <main id="main-content" style={step === 0 ? S.mainLanding : S.main} role="main">
        <div style={{animation: animateIn ? "fadeSlideIn 0.35s ease-out forwards" : "none"}}>
          {step === 0 && renderLanding()}
          {step === 1 && renderStep0()}
          {step === 2 && renderStep1()}
          {step === 3 && renderStep2()}
          {step === 4 && renderResults()}
        </div>
      </main>
      <footer style={S.footer} role="contentinfo">
        <p>My Wise Relocation is for informational purposes only and does not constitute legal or immigration advice. Visa requirements change frequently — always verify with official government sources.</p>
        <p style={{marginTop:8}}>A product of the <a href="https://mywisetravel.com" target="_blank" rel="noopener noreferrer" style={{color:"#8B6D2E",textDecoration:"none",borderBottom:"1px solid #8B6D2E"}}>My Wise Travel</a> family.</p>
      </footer>
    </div>
  );
}

const S = {
  page:{fontFamily:"Georgia,'Times New Roman',serif",minHeight:"100vh",background:"linear-gradient(175deg,#FAF8F4 0%,#F3F1EB 40%,#F8F9FC 100%)",color:"#1E2330",display:"flex",flexDirection:"column"},

  mainLanding:{flex:1,width:"100%"},
  hero:{background:"linear-gradient(175deg,#F0EDE6 0%,#F3F1EB 40%,#FAF8F4 100%)",padding:"80px 24px 60px",textAlign:"center",borderBottom:"1px solid rgba(139,109,46,0.12)"},
  heroInner:{maxWidth:680,margin:"0 auto"},
  heroEyebrow:{fontSize:11,letterSpacing:"0.2em",color:"#8B6D2E",marginBottom:16,fontWeight:"normal"},
  heroTitle:{fontFamily:"Georgia,'Times New Roman',serif",fontSize:"clamp(28px,5vw,44px)",color:"#1E2330",marginBottom:20,outline:"none",letterSpacing:"0.02em",fontWeight:"normal",lineHeight:1.25},
  heroDesc:{fontSize:16,color:"#5a564d",lineHeight:1.7,marginBottom:36,maxWidth:560,margin:"0 auto 36px"},
  heroCta:{padding:"14px 36px",borderRadius:6,border:"none",background:"#8B6D2E",color:"#F8F9FC",fontSize:15,fontWeight:"normal",cursor:"pointer",boxShadow:"0 2px 8px rgba(139,109,46,0.25)",letterSpacing:"0.12em",transition:"background 0.2s"},
  statsBar:{display:"flex",justifyContent:"center",alignItems:"center",gap:"clamp(16px,4vw,40px)",padding:"28px 24px",background:"#FFFFFF",borderBottom:"1px solid rgba(44,42,37,0.08)",flexWrap:"wrap"},
  statItem:{display:"flex",flexDirection:"column",alignItems:"center",gap:4},
  statNumber:{fontSize:24,fontWeight:600,color:"#8B6D2E",letterSpacing:"0.03em"},
  statLabel:{fontSize:11,color:"#7A756B",letterSpacing:"0.1em",textTransform:"uppercase"},
  statDivider:{width:1,height:36,background:"rgba(44,42,37,0.12)"},
  landingSection:{maxWidth:860,margin:"0 auto",padding:"48px 24px"},
  sectionTitle:{fontSize:12,letterSpacing:"0.18em",color:"#8B6D2E",marginBottom:28,textAlign:"center",fontWeight:"normal"},
  stepsGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20},
  stepCard:{background:"#FFFFFF",borderRadius:8,padding:"28px 24px",border:"1px solid rgba(44,42,37,0.08)",textAlign:"center"},
  stepCardNumber:{width:36,height:36,borderRadius:"50%",background:"rgba(139,109,46,0.08)",color:"#8B6D2E",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:600,marginBottom:14,border:"1.5px solid rgba(139,109,46,0.2)"},
  stepCardTitle:{fontSize:16,color:"#1E2330",marginBottom:8,fontWeight:"normal",letterSpacing:"0.02em"},
  stepCardDesc:{fontSize:13,color:"#5a564d",lineHeight:1.65},
  featuresGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16},
  featureCard:{background:"#FFFFFF",borderRadius:8,padding:"24px 20px",border:"1px solid rgba(44,42,37,0.08)"},
  featureIcon:{fontSize:24,display:"block",marginBottom:10},
  featureTitle:{fontSize:14,color:"#1E2330",marginBottom:6,fontWeight:600,letterSpacing:"0.02em"},
  featureDesc:{fontSize:13,color:"#5a564d",lineHeight:1.6},
  landingCta:{textAlign:"center",padding:"32px 24px 56px",background:"rgba(139,109,46,0.03)",borderTop:"1px solid rgba(139,109,46,0.08)"},
  landingCtaText:{fontSize:18,color:"#1E2330",marginBottom:20,fontFamily:"Georgia,'Times New Roman',serif",letterSpacing:"0.02em"},
  skipLink:{position:"absolute",left:"-9999px",top:"auto",width:"1px",height:"1px",overflow:"hidden",zIndex:1000,background:"#1E2330",color:"#F8F9FC",padding:"12px 24px",fontSize:16,fontWeight:600,textDecoration:"none",borderRadius:4},
  header:{background:"#FFFFFF",padding:"0",borderBottom:"1px solid rgba(44,42,37,0.12)",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"},
  headerInner:{maxWidth:960,margin:"0 auto",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12},
  logoArea:{display:"flex",alignItems:"center",gap:12},
  logoIcon:{fontSize:36},
  logoTitle:{fontFamily:"Georgia,'Times New Roman',serif",fontSize:17,color:"#8B6D2E",letterSpacing:"0.12em",lineHeight:1.2,fontWeight:"normal"},
  logoSub:{fontSize:10,color:"#7A756B",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:"normal",marginTop:3},
  stepper:{display:"flex",gap:24,alignItems:"center"},
  stepDot:{display:"flex",alignItems:"center",gap:6,opacity:0.4},
  stepDotActive:{opacity:1},
  dot:{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,background:"rgba(139,109,46,0.08)",color:"#7A756B",border:"1.5px solid rgba(139,109,46,0.2)"},
  dotActive:{background:"#8B6D2E",color:"#FFFFFF",borderColor:"#8B6D2E"},
  stepLabelText:{fontSize:12,color:"#7A756B",fontWeight:"normal",letterSpacing:"0.08em"},
  main:{flex:1,maxWidth:960,margin:"0 auto",padding:"32px 24px",width:"100%"},
  stepTitle:{fontFamily:"Georgia,'Times New Roman',serif",fontSize:26,color:"#1E2330",marginBottom:6,outline:"none",letterSpacing:"0.03em",fontWeight:"normal"},
  stepSub:{fontSize:14,color:"#7A756B",marginBottom:28},
  fieldset:{border:"none",padding:0,margin:0},
  catGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:32},
  catCard:{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"20px 12px",borderRadius:8,border:"1.5px solid rgba(44,42,37,0.12)",background:"#FFFFFF",cursor:"pointer",transition:"all 0.2s",fontSize:13,fontWeight:"normal",color:"#1E2330",letterSpacing:"0.02em"},
  catCardActive:{borderColor:"#8B6D2E",background:"rgba(139,109,46,0.06)",color:"#1E2330",boxShadow:"0 2px 12px rgba(139,109,46,0.1)"},
  catIcon:{fontSize:28},
  catLabel:{textAlign:"center",lineHeight:1.3},
  label:{display:"block",fontSize:13,fontWeight:"normal",color:"#1E2330",marginBottom:10,marginTop:24,letterSpacing:"0.06em",textTransform:"uppercase"},
  radioGroup:{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8},
  radioBtn:{padding:"8px 16px",borderRadius:6,border:"1.5px solid rgba(44,42,37,0.15)",background:"#FFFFFF",cursor:"pointer",fontSize:13,fontWeight:"normal",color:"#1E2330",transition:"all 0.15s"},
  radioBtnActive:{borderColor:"#8B6D2E",background:"rgba(139,109,46,0.06)",color:"#1E2330"},
  sliderRow:{display:"flex",alignItems:"center",gap:16,marginBottom:16,marginTop:8},
  sliderLabel:{fontSize:14,fontWeight:"normal",color:"#1E2330",minWidth:150},
  slider:{flex:1},
  sliderValue:{fontSize:13,fontWeight:600,color:"#8B6D2E",minWidth:30,textAlign:"right"},
  navRow:{display:"flex",justifyContent:"space-between",marginTop:36,gap:12},
  btnPrimary:{padding:"12px 28px",borderRadius:6,border:"none",background:"#8B6D2E",color:"#F8F9FC",fontSize:14,fontWeight:"normal",cursor:"pointer",boxShadow:"0 1px 4px rgba(139,109,46,0.25)",letterSpacing:"0.1em"},
  btnSecondary:{padding:"12px 24px",borderRadius:6,border:"1.5px solid rgba(44,42,37,0.2)",background:"transparent",color:"#1E2330",fontSize:13,fontWeight:"normal",cursor:"pointer",letterSpacing:"0.06em"},
  btnCompare:{padding:"10px 20px",borderRadius:6,border:"1.5px solid #8B6D2E",background:"rgba(139,109,46,0.06)",color:"#8B6D2E",fontSize:13,fontWeight:"normal",cursor:"pointer",letterSpacing:"0.06em"},
  resultsHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:24},
  resultsActions:{display:"flex",gap:10,flexWrap:"wrap"},
  resultsList:{display:"flex",flexDirection:"column",gap:12},
  countryCard:{background:"#FFFFFF",borderRadius:8,border:"1px solid rgba(44,42,37,0.1)",boxShadow:"0 1px 4px rgba(0,0,0,0.04)",overflow:"hidden",animation:"cardIn 0.3s ease-out both"},
  countryHeaderRow:{display:"flex",alignItems:"center"},
  checkboxLabel:{display:"flex",alignItems:"center",justifyContent:"center",padding:"0 0 0 16px",flexShrink:0},
  countryHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px 16px 12px",cursor:"pointer",flex:1,background:"none",border:"none",textAlign:"left",fontFamily:"inherit",fontSize:"inherit",color:"inherit",width:"100%"},
  countryLeft:{display:"flex",alignItems:"center",gap:12},
  checkbox:{width:18,height:18,accentColor:"#8B6D2E",cursor:"pointer"},
  flag:{fontSize:30},
  countryName:{display:"block",fontSize:16,fontWeight:"normal",color:"#1E2330",letterSpacing:"0.03em"},
  countryMeta:{display:"block",fontSize:12,color:"#7A756B",marginTop:2},
  countryRight:{display:"flex",alignItems:"center",gap:12},
  scoreBadge:{padding:"6px 14px",borderRadius:4,fontSize:13,fontWeight:600,background:"#8B6D2E",color:"#F8F9FC",letterSpacing:"0.04em"},
  expandArrow:{fontSize:16,color:"#7A756B"},
  countryBody:{padding:"0 20px 20px",borderTop:"1px solid rgba(44,42,37,0.08)"},
  factorRow:{display:"flex",flexWrap:"wrap",gap:10,padding:"16px 0"},
  factorChip:{padding:"8px 14px",borderRadius:6,background:"rgba(139,109,46,0.04)",border:"1px solid rgba(139,109,46,0.12)",fontSize:12},
  factorLabel:{fontWeight:600,color:"#1E2330",marginBottom:3,letterSpacing:"0.04em"},
  factorStars:{color:"#8B6D2E",letterSpacing:1},
  visaList:{display:"flex",flexDirection:"column",gap:8},
  visaCard:{borderRadius:6,border:"1px solid rgba(44,42,37,0.1)",overflow:"hidden"},
  visaHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",cursor:"pointer",background:"rgba(139,109,46,0.03)",border:"none",width:"100%",fontFamily:"inherit",fontSize:"inherit",color:"inherit"},
  visaType:{display:"block",fontSize:14,fontWeight:600,color:"#1E2330",letterSpacing:"0.02em"},
  visaCat:{display:"block",fontSize:11,color:"#7A756B",marginTop:2},
  visaBody:{padding:"14px 16px",background:"#FFFFFF"},
  visaNotes:{fontSize:13,lineHeight:1.7,color:"#1E2330",marginBottom:14},
  visaDetails:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,margin:0,padding:0},
  visaDetail:{padding:"10px 12px",borderRadius:6,background:"rgba(139,109,46,0.04)",border:"1px solid rgba(139,109,46,0.1)"},
  detailLabel:{display:"block",fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",color:"#7A756B",marginBottom:3},
  detailValue:{display:"block",fontSize:14,fontWeight:600,color:"#1E2330",margin:0},
  visaLink:{display:"inline-block",marginTop:14,padding:"10px 20px",background:"rgba(139,109,46,0.08)",border:"1.5px solid #8B6D2E",borderRadius:6,color:"#8B6D2E",fontSize:13,fontWeight:600,textDecoration:"none",letterSpacing:"0.06em",transition:"background 0.15s"},
  compareTable:{marginBottom:24,overflowX:"auto",borderRadius:8,border:"1px solid rgba(44,42,37,0.1)",background:"#FFFFFF"},
  table:{width:"100%",borderCollapse:"collapse",fontSize:13},
  th:{padding:"12px 16px",textAlign:"left",fontWeight:600,background:"rgba(139,109,46,0.04)",borderBottom:"1.5px solid rgba(44,42,37,0.1)",color:"#1E2330",letterSpacing:"0.04em"},
  td:{padding:"10px 16px",borderBottom:"1px solid rgba(44,42,37,0.06)",color:"#1E2330"},
  footer:{maxWidth:960,margin:"0 auto",padding:"24px",fontSize:12,color:"#7A756B",lineHeight:1.7,textAlign:"center"},
};
