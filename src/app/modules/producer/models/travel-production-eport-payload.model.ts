import { ExportFilter } from "src/app/shared/models/export-filter.model";

export class TravelProductionReportPayload {
    public from: Date;
    public to: Date;
    public channel: string;
    public entityIds: Array<number>;
    public filters: Array<ExportFilter>;
}