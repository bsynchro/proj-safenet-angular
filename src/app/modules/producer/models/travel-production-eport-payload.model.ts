import { ExportFilter } from "src/app/shared/models/export-filter.model";

export class TravelProductionReportPayload {
    public from: string;
    public to: string;
    public channel: string;
    public entityIds: Array<number>;
    public filters: Array<ExportFilter>;
}