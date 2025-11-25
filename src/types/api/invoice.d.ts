declare interface IInvoiceVendor {
    name: string;
    address: string;
    geo_hint: string;
}

declare interface IInvoiceTotals {
    subtotal: string;
    discount: string;
    tax: string;
    grand_total: string;
}

declare interface IInvoiceItem {
    brand: string | null;
    category: string;
    quantity: number;
    raw_name: string;
    line_total: number;
    unit_price: number;
    plant_based: boolean;
    matched_shopping_list: boolean;
}

declare interface IInvoiceDoc {
    source_id: string;
    currency: string;
    payment_method: string;
    notes: string;
}

declare interface IInvoiceDatetime {
    date: string;
    time: string;
}

declare interface IInvoice {
    id: string;
    doc: IInvoiceDoc;
    vendor: IInvoiceVendor;
    datetime: IInvoiceDatetime;
    items: IInvoiceItem[];
    totals: IInvoiceTotals;
    createdAt: Date;
    updatedAt: Date;
}