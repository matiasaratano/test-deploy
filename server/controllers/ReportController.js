import ReportService from '../services/ReportService/ReportService.js';

class ReportController {
    constructor() {
        this.reportService = new ReportService();
    }

    generateReport = async (req, res) => {
        try {
            const { month, year } = req.params;
            const report = await this.reportService.generateReport(month, year);
            res.json(report);
        } catch (error) {
            console.error(`Error al generar el informe: ${error}`);
            res.status(500).json({ error: 'Hubo un problema al generar el informe.' });
        }
    };
}

export default ReportController;