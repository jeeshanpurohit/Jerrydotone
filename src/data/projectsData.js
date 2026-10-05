import rawProjects from "./projectsData.json";

export const allPortfolioProjects = rawProjects;

export const projectStats = {
  total: rawProjects.length,
  graphicDesign: rawProjects.filter(p => p.category === "graphic-design").length,
  videoEditing: rawProjects.filter(p => p.category === "video-editing").length,
  photography: rawProjects.filter(p => p.category === "photography").length,
};

export const clientList = [
  "All Clients",
  "Cleopatra",
  "Mencave",
  "Kreq",
  "Garv",
  "The Drop Culture",
  "Meadows",
  "Olive Court",
  "Saga",
  "Ravora",
  "The Social Chutney",
  "New Year Flyers"
];
