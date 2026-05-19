export function calculateOverallRating(ratings: {
  egg: number;
  taste: number;
  freshness: number;
  price: number;
  scam: number;
}) {
  const baseScore = 
    (ratings.egg * 0.35) + 
    (ratings.taste * 0.25) + 
    (ratings.freshness * 0.20) + 
    (ratings.price * 0.20);
  
  // Scam level reduces the score by up to 1 point (0.1 per level)
  const reduction = ratings.scam * 0.1;
  
  return Math.max(0, Math.min(10, baseScore - reduction));
}

export function getPuffBadge(ratings: {
  egg: number;
  taste: number;
  freshness: number;
  price: number;
  scam: number;
}) {
  if (ratings.egg >= 8 && ratings.scam <= 2) return "Certified Mutta";
  if (ratings.egg <= 2 && ratings.scam >= 8) return "Egg Missing Case";
  if (ratings.freshness <= 3) return "Cold Case Puff";
  if (ratings.taste >= 8) return "Flavor Witness Approved";
  if (ratings.price >= 8) return "Budget Hero";
  return "Puff Report Filed";
}

export function getScamAlerts(ratings: {
  egg: number;
  freshness: number;
  scam: number;
}) {
  const alerts = [];
  if (ratings.scam >= 7) alerts.push("High Scam Probability");
  if (ratings.egg <= 3) alerts.push("Low Egg Evidence");
  if (ratings.freshness <= 3) alerts.push("Freshness Under Investigation");
  return alerts;
}

export function formatReviewDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
