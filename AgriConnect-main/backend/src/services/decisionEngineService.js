/**
 * Farm-to-Market Decision Engine Service
 * Calculates estimated net returns by taking crop yields, indicative prices,
 * and subtracting cold storage, transit, and packaging/handling costs.
 */
class DecisionEngineService {
  /**
   * Calculate full breakdown of Gross, Storage, Logistics, and Net value
   * @param {Object} params
   * @param {string} params.crop - Crop name
   * @param {number} params.quantity - Quantity in kg
   * @param {number} params.indicativePrice - Price per kg in INR
   * @param {number} [params.storageCostPerKg] - Storage cost per kg per month
   * @param {number} [params.storageMonths] - Duration of storage in months (default 1)
   * @param {number} [params.transportBaseCost] - Base logistics cost
   * @param {number} [params.distanceKm] - Estimated transit distance in km
   * @param {number} [params.ratePerKm] - Transport rate per km
   * @param {number} [params.otherCosts] - Loading, packing, handling
   */
  calculateNetReturn({
    crop,
    quantity = 1000,
    indicativePrice = 20,
    storageCostPerKg = 2,
    storageMonths = 1,
    includeStorage = true,
    transportBaseCost = 500,
    distanceKm = 40,
    ratePerKm = 15,
    includeLogistics = true,
    otherCosts = 250
  }) {
    const qty = Math.max(0, Number(quantity) || 0);
    const price = Math.max(0, Number(indicativePrice) || 0);

    // 1. Gross Market Value
    const estimatedGrossValue = Math.round(qty * price);

    // 2. Storage Cost (if opted)
    const estimatedStorageCost = includeStorage 
      ? Math.round(qty * (Number(storageCostPerKg) || 2) * (Number(storageMonths) || 1))
      : 0;

    // 3. Transport Cost (if opted)
    const transportKmCost = (Number(distanceKm) || 40) * (Number(ratePerKm) || 15);
    const estimatedTransportCost = includeLogistics 
      ? Math.round((Number(transportBaseCost) || 500) + transportKmCost)
      : 0;

    // 4. Other Handling / Weighment / Bagging costs
    const estimatedOtherCosts = Math.round(Number(otherCosts) || 0);

    // 5. Total deductions
    const totalEstimatedCosts = estimatedStorageCost + estimatedTransportCost + estimatedOtherCosts;

    // 6. Net Value to Farmer
    const estimatedNetValue = Math.max(0, estimatedGrossValue - totalEstimatedCosts);

    // 7. Margin Percentage
    const netMarginPercent = estimatedGrossValue > 0 
      ? Math.round((estimatedNetValue / estimatedGrossValue) * 100) 
      : 0;

    return {
      crop,
      quantity: qty,
      unit: 'kg',
      indicativePrice: price,
      estimatedGrossValue,
      estimatedCosts: {
        storageCost: estimatedStorageCost,
        transportCost: estimatedTransportCost,
        otherCosts: estimatedOtherCosts,
        totalCost: totalEstimatedCosts
      },
      estimatedNetValue,
      netMarginPercent,
      disclaimer: 'Estimated value based on indicative/demo data. Not a legal or financial guarantee.',
      sourceType: 'INDICATIVE_ESTIMATE'
    };
  }
}

module.exports = new DecisionEngineService();
