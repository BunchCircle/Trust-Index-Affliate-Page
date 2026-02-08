
// --- Constants ---
export const AFFILIATE_LINK = "https://www.trustindex.io/ti-redirect.php?a=andaman&c=my_campaign";
export const VIDEO_PLACEHOLDER_URL = "/trust-revenue.jpg";
export const PROFILE_PIC_URL = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=256&auto-format&fit=crop";

export const LOGO_MARQUEE = ["Google", "Facebook", "Yelp", "Amazon", "G2", "Tripadvisor", "Trustpilot", "App Store", "Booking.com", "Capterra"];

// --- Backend Integration Helper ---
export const submitLeadToBackend = async (email: string, name?: string, sheetName?: string) => {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSIdLPXef1_-W-rOWjeoV_Akva5HLnxX4a85X8LteKYs3VMeH5f-PuXy9t19rirX4i/exec";
    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // Required for Google Apps Script Web Apps
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, sheetName })
        });
    } catch (error) {
        console.error("Lead submission failed:", error);
    }
};
