// Function to calculate the entropy of a list of data with smoothing
function calculateEntropy(data) {
    // Check if the list is empty
    if (data.length === 0) {
        console.error("The data list is empty.");
        return null;
    }

    // Calculate the frequency of each class
    let classFrequency = {};
    data.forEach((value) => {
        classFrequency[value] = (classFrequency[value] || 0) + 1;
    });

    // Calculate the probability of each class with smoothing
    let totalData = data.length;
    let probabilities = Object.values(classFrequency).map((frequency) => (frequency + 1) / (totalData + Object.keys(classFrequency).length));

    // Calculate the entropy with smoothing
    let entropy = -probabilities.reduce((accumulator, probability) => {
        return accumulator + (probability * Math.log2(probability + Number.EPSILON)); // Add Number.EPSILON to avoid the logarithm of zero
    }, 0);

    return entropy;
}