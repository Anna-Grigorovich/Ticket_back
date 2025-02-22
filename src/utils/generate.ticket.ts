import {generateBarcode, generateQRCode} from './generate.codes';
import {EventModel} from "../mongo/models/event.model";
import {TicketModel} from "../mongo/models/ticket.model";
import {EventPrice} from "../mongo/schemas/event.price";
import {EventPriceModel} from "../mongo/models/event-price.model";

const PDFDocument = require('pdfkit');
const fs = require('fs');
const sharp = require('sharp');

const svgToPng = async (svgText: string) => {
    return await sharp(Buffer.from(svgText)).png().toBuffer();
};

const getImageDimensions = async (imagePath: string) => {
    const {width, height} = await sharp(imagePath).metadata();
    return {width, height};
};

const formatTimestampToUkrainian = (timestamp: number) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    const formattedDate = new Intl.DateTimeFormat('uk-UA', options).format(date);
    return formattedDate;
};

export const createTicketPdf = async (ticket: TicketModel, eventData: EventModel, posterPath: string, outputPath: string) => {
    const priceModel: EventPriceModel = eventData.prices.find(p=> p.price === ticket.price)
    const doc = new PDFDocument({size: 'A4', margins: {top: 50, left: 50, right: 50, bottom: 0}});
    doc.registerFont('Play', './resources/fonts/Play-Regular.ttf');
    doc.registerFont('PlayBold', './resources/fonts/Play-Bold.ttf');
    doc.pipe(fs.createWriteStream(outputPath));

    // POSTER IMAGE
    let calculatedHeight = 300
    if (fs.existsSync(posterPath)) {
        const {width: originalWidth, height: originalHeight} = await getImageDimensions(posterPath);
        const desiredWidth = 200; // Set the width of the image
        const aspectRatio = originalHeight / originalWidth;
        calculatedHeight = desiredWidth * aspectRatio; // Calculate the proportional height
        doc.image(posterPath, 25, 25, {
            width: desiredWidth
        });
    } else {
        console.error(`Image not found at path: ${posterPath}`);
    }

    // EVENT BARCODE
    const barcodeSvg = generateBarcode(ticket._id.toString());
    const barcodePngBuffer = await svgToPng(barcodeSvg);
    doc.image(barcodePngBuffer, 25, calculatedHeight + 30, {width: 200});

    // LEGAL TEXT
    doc.font('PlayBold').fontSize(14).text('ЦЕ ТВІЙ КВИТОК', 25, calculatedHeight + 80);
    doc.fontSize(8).text('РОЗДРУКУЙТЕ АБО ПОКАЖІТЬ ЦЕЙ КВИТОК З ТЕЛЕФОНА', {width: 200, align: 'justify'});
    doc.font('Play').fontSize(8).text('Унікальний штрих-код може бути використаний лише один раз. Не копіюйте цей квиток і не публікуйте його в інтернеті. Це може стати перешкодою вашого входу на подію. За збереження даних організатор відповідальності не несе.', {
        width: 200,
        align: 'justify'
    });

    // EVENT QR
    doc.moveDown();
    const qrCodeBase64 = await generateQRCode(ticket._id.toString());
    const qrImageBuffer = Buffer.from(qrCodeBase64, 'base64');
    doc.image(qrImageBuffer, 50, doc.y, {width: 150, height: 150});

    // EVENT NAME
    doc.font('PlayBold').fontSize(14).text(eventData.title, 250, 22, {width: 350});
    doc.moveDown();

    // EVENT CLUB
    doc.font('PlayBold').fontSize(14).text(eventData.place);
    // EVENT ADDRESS
    doc.font('Play').fontSize(14).text(eventData.address);
    doc.moveDown();
    // EVENT DATE
    const formattedDate = formatTimestampToUkrainian(eventData.date);
    doc.font('PlayBold').fontSize(14).text(formattedDate.toUpperCase());
    doc.moveDown();
    // EVENT PRICE
    doc.font('PlayBold').fontSize(14).text(`ЦІНА: ${ticket.price} ГРН`);
    if(priceModel.description){
        doc.font('PlayBold').fontSize(14).text(priceModel.description);
    }
    if(priceModel.place){
        doc.font('PlayBold').fontSize(14).text(`МІСЦЕ: ${priceModel.place}`);
    }
    // FOOTER
    doc.image('./resources/footer.jpg', 0, 755, {width: 595});
    doc.font('Play').fontSize(10).fillColor('white').text('tel: 063 603 7569', 25, 780);
    doc.font('Play').fontSize(10).text('mail: kievkills@gmail.com');
    doc.font('Play').fontSize(10).text('вул. Михайла Омеляновича-Павленка 4/6, Kyiv, Ukraine');
    doc.end();
};

// createTicketPdf(
//     '64b1f00c2c16b8e25b485ff7',
//     {title: "Концерт жаби і гадюки", place: "Жопа кабана", address: "", date: Date.now(), price: 250, image: '', description: ''},
//     'F:/projects/kibalnik_back/uploads/images/67016312dde4a9a228bbb64d.jpg',
//     'F:/projects/kibalnik_back/temp/out.pdf')
