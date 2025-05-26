const QRCode = require('qrcode');
const JsBarcode = require('jsbarcode');
const {DOMImplementation, XMLSerializer} = require('xmldom');

export const generateQRCode = async (mongodbId: string) => {
    const qrCodeDataUrl = await QRCode.toDataURL(mongodbId);
    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
    return base64Data
};

export const generateBarcode = (mongodbId: string) => {
    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    JsBarcode(svgNode, mongodbId, {
        xmlDocument: document,
        displayValue: false,
        format: 'CODE128',
    });

    return  xmlSerializer.serializeToString(svgNode);
};
