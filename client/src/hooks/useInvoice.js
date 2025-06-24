// src/hooks/useInvoice.js
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "../pages/Invoice/InvoicePDF";
import Swal from "sweetalert2";
import axios from "axios";

export const useInvoice = ({ isMobile, token, invoiceData, navigate }) => {

    const handlePrint = () => {
        const content = isMobile
            ? document.getElementById("mobile-invoice-print-wrapper")
            : document.getElementById("invoice");

        const width = isMobile ? 350 : 1000;
        const height = isMobile ? 600 : 1000;

        const printWindow = window.open("", "", `width=${width},height=${height}`);

        // For desktop - copy existing stylesheet content
        const styleToUse = [...document.styleSheets]
            .map((sheet) => {
                try {
                    return [...sheet.cssRules].map((rule) => rule.cssText).join("");
                } catch (e) {
                    return ""; // Skip CORS-protected stylesheets
                }
            })
            .join("");

        printWindow.document.write(`
    <html>
      <head>
        <title>Invoice Print</title>
        <style>${styleToUse}</style>
      </head>
      <body>${content.outerHTML}</body></html>
  `);

        printWindow.document.close();
        printWindow.focus();

        // Wait to ensure layout is applied before printing
        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    };
    const handleDownloadPDF = () => {
        pdf(<InvoicePDF invoiceData={invoiceData} />)
            .toBlob()
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `invoice-${invoiceData.invoiceId}.pdf`;
                a.click();
                URL.revokeObjectURL(url); // Clean up memory
            });
    };

    const handleShare = () => {
        const domain = window.location.origin;
        const shareUrl = `${domain}/invoice/c/${invoiceData.invoiceId}`;
        if (navigator.share) {
            navigator
                .share({
                    title: "Invoice",
                    text: "View your invoice from Rehmat Textile.",
                    url: shareUrl,
                })
                .then(() => console.log("Shared successfully"))
                .catch((error) => {
                    console.error("Error sharing:", error);
                    alert("Sharing failed. You can still copy the link.");
                    navigator.clipboard.writeText(window.location.href);
                });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        } else {
            // Final fallback
            const textarea = document.createElement("textarea");
            textarea.value = window.location.href;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            alert("Link copied to clipboard (fallback)!");
        }
    };

    const handleCancelSale = async (idFromButton) => {
        const { value: inputInvoiceId } = await Swal.fire({
            title: "Confirm Cancellation",
            input: "text",
            inputLabel: "Re-enter Invoice ID to confirm",
            inputPlaceholder: "Type invoice ID here...",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it",
            cancelButtonText: "No, go back",
            inputValidator: (value) => {
                if (!value) {
                    return "You must enter the Invoice ID!";
                }
            },
        });

        if (inputInvoiceId !== invoiceData.invoiceId) {
            Swal.fire({
                icon: "error",
                title: "Invoice ID mismatch",
                text: "The ID you entered does not match this invoice.",
            });
            return;
        }

        try {
            const res = await axios.put(
                `http://localhost:5000/api/sales/${idFromButton}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Swal.fire({
                icon: "success",
                title: "Sale cancelled",
                text: res.data.message || "Sale has been cancelled.",
            }).then(() => {
                navigate("/sales");
            });
        } catch (error) {
            console.error("Cancel error:", error);
            Swal.fire({
                icon: "error",
                title: "Cancel failed",
                text:
                    error?.response?.data?.message ||
                    "Something went wrong. Try again or contact support.",
            });
        }
    };

    return {
        handlePrint,
        handleDownloadPDF,
        handleShare,
        handleCancelSale,
    };
};
