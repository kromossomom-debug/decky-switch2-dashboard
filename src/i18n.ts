/**
 * The plugin's text in English and Portuguese, picked from Steam's own UI language.
 * Steam reloads its whole UI (and this plugin) when the language changes, so it's read once.
 */
const en = {
  // HOME Menu
  allSoftware: "All Software",
  back: "Back",
  sort: "Sort",
  sortRecent: "Last played",
  sortPlaytime: "Play time",
  sortTitle: "Title",
  notInstalled: "Not installed",
  emptyLibrary: "No software yet.",
  myPage: "My Page",
  online: "Steam Online",
  chat: "Chat",
  news: "News",
  store: "Steam Store",
  album: "Album",
  remotePlay: "Remote Play",
  controllers: "Controllers",
  library: "Library",
  settings: "System Settings",
  sleep: "Sleep Mode",
  options: "Options",
  start: "Start",
  resume: "Resume",
  open: "Open",
  noSoftware: "Play something and it shows up here.",
  // Quick Access panel
  enableLabel: "Switch 2 HOME Menu",
  enableDesc: "Replaces the Steam home screen with the Switch 2-style HOME Menu.",
  themeLabel: "Theme",
  themeBlack: "Basic Black",
  themeWhite: "Basic White",
  artLabel: "Tile art",
  artPortrait: "Cover (cropped)",
  artLandscape: "Banner (cropped)",
  artHero: "Hero art (cropped)",
  countLabel: "Software in the row",
  hideBarsLabel: "Hide Steam's top and bottom bars",
  hideBarsDesc: "Only on the HOME Menu, which draws its own status bar and button hints.",
  clock24Label: "24-hour clock",
  supportSection: "Support the project",
  supportText: "Enjoying the plugin? Buy the author a coffee and help keep it updated.",
};

const pt: typeof en = {
  allSoftware: "Todos os jogos",
  back: "Voltar",
  sort: "Ordenar",
  sortRecent: "Jogados recentemente",
  sortPlaytime: "Tempo de jogo",
  sortTitle: "Título",
  notInstalled: "Não instalado",
  emptyLibrary: "Nenhum jogo ainda.",
  myPage: "Minha página",
  online: "Steam Online",
  chat: "Chat",
  news: "Notícias",
  store: "Loja Steam",
  album: "Álbum",
  remotePlay: "Remote Play",
  controllers: "Controles",
  library: "Biblioteca",
  settings: "Configurações do sistema",
  sleep: "Modo de espera",
  options: "Opções",
  start: "Iniciar",
  resume: "Voltar ao jogo",
  open: "Abrir",
  noSoftware: "Jogue algo e ele aparece aqui.",
  enableLabel: "Menu HOME do Switch 2",
  enableDesc: "Troca a tela inicial da Steam pelo Menu HOME no estilo do Switch 2.",
  themeLabel: "Tema",
  themeBlack: "Preto básico",
  themeWhite: "Branco básico",
  artLabel: "Arte dos blocos",
  artPortrait: "Capa (recortada)",
  artLandscape: "Banner (recortado)",
  artHero: "Arte hero (recortada)",
  countLabel: "Jogos na fileira",
  hideBarsLabel: "Esconder as barras da Steam",
  hideBarsDesc: "Só no Menu HOME, que desenha a própria barra de status e as dicas de botões.",
  clock24Label: "Relógio de 24 horas",
  supportSection: "Apoie o projeto",
  supportText: "Curtiu o plugin? Pague um café para o autor e ajude a manter as atualizações.",
};

function steamLocale(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const locales = (window as any).LocalizationManager?.GetPreferredLocales?.();
    if (locales?.[0]) return String(locales[0]).toLowerCase();
  } catch {
    // fall through
  }
  try {
    // Steam passes its language name ("brazilian", "portuguese", "english"...) to the UI page.
    const lang = new URLSearchParams(window.location.search).get("LANGUAGE");
    if (lang) return lang.toLowerCase();
  } catch {
    // fall through
  }
  return navigator.language.toLowerCase();
}

const locale = steamLocale();
export const t = locale.startsWith("pt") || locale === "brazilian" ? pt : en;
