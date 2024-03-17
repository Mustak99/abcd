import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

class Product {
  name: string = '';
  price: number = 0;
  qty: number = 0;
  toPlainObject() {
    return {
      name: this.name,
      price: this.price,
      qty: this.qty,
    };
  }
}

class Invoice {
  customerName: string = '';
  address: string = '';
  contactNo: number = 0;
  email: string = '';

  products: Product[] = [];
  additionalDetails: string = '';

  constructor() {
    this.products.push(new Product());
  }
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent {
  invoiceForm!: FormGroup;
  manager_id: any;
  master_id: any;
  toggle = true;
  invoices: any[] = [];

  constructor(private firestore: AngularFirestore, private fb: FormBuilder) {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {
    const pdfIcon = document.getElementById('pdfIcon');
    if (pdfIcon) {
      pdfIcon.innerHTML = '<i class="fa fa-file-pdf-o"></i>';
    }

    this.manager_id = sessionStorage.getItem('manager_id');
    this.getMasterId(this.manager_id);

    this.invoiceForm = this.fb.group({
      vendorName: ['', Validators.required],
      quantity: [1, Validators.required],
      unitPrice: ['', Validators.required],
      description: ['', Validators.required],
    });
    // this.fetchInvoices(this.manager_id);
  }

  onof(parametr: boolean) {
    this.toggle = parametr;
  }

  async getMasterId(managerId: any) {
    try {
      const userDocRef = this.firestore
        .collection('managers')
        .doc(managerId)
        .snapshotChanges();
      userDocRef.subscribe((doc: any) => {
        if (doc.payload.exists) {
          const userData = doc.payload.data();
          this.master_id = userData.master_id;
        } else {
          console.error('Manager document does not exist');
        }
      });
    } catch (error) {
      console.error('Error fetching machine data:', error);
    }
  }

  async fetchInvoices(userId: string) {
    try {
      const snapshot = await this.firestore
        .collection('invoices', (ref) =>
          ref.where(this.manager_id ? 'manager_id' : 'master_id', '==', userId)
        )
        .get()
        .toPromise();
      if (snapshot) {
        const data = snapshot.docs.map((doc: any) => (doc.data() as any).data);
        this.invoices = data;
        console.error('data', data);
      } else {
        this.invoices = [];
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
      this.invoices = [];
    }
  }
  onDataAdded(event: any) {
    console.log('Data added in dashboard:', event);
  }

  invoice = new Invoice();

  openInvoice(invoice: any) {
    this.invoice = invoice; // Set the selected invoice
    this.generatePDF('open'); // Generate PDF for the selected invoice
  }
  viewInvoice(invoice: any) {
    this.invoice = invoice; // Set the selected invoice
    this.generatePDF('view'); // Generate PDF for the selected invoice
  }
  generatePDF(action = 'open') {
    let billNumber = (Math.random() * 1000).toFixed(0);
    let docDefinition: any = {
      content: [
        {
          text: 'Ginza Industries Limited (UDHNA WAREHOUSE)',
          fontSize: 16,
          alignment: 'center',
          color: '#047886',
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue',
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader',
        },
        {
          columns: [
            [
              {
                text: this.invoice.customerName,
                bold: true,
              },
              { text: this.invoice.address },
              { text: this.invoice.email },
              { text: this.invoice.contactNo },
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right',
              },
              {
                text: `Bill No : ${billNumber}`,
                alignment: 'right',
              },
            ],
          ],
        },
        {
          text: 'Order Details',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount'],
              ...this.invoice.products.map((p) => [
                p.name,
                p.price,
                p.qty,
                (p.price * p.qty).toFixed(2),
              ]),
              [
                { text: 'Total Amount', colSpan: 3 },
                {},
                {},
                this.invoice.products
                  .reduce((sum, p) => sum + p.qty * p.price, 0)
                  .toFixed(2),
              ],
            ],
          },
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader',
        },
        {
          text: this.invoice.additionalDetails,
          margin: [0, 0, 0, 15],
        },
        {
          columns: [
            [{ qr: `${this.invoice.customerName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true }],
          ],
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader',
        },
        {
          ul: [
            'Order can be return in max 10 days.',
            'Warrenty of the product will be subject to the manufacturer terms and conditions.',
            'This is system generated invoice.',
          ],
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
      },
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else if (action === 'view') {
      pdfMake.createPdf(docDefinition).open();
      this.invoice = new Invoice();
      this.invoiceForm.reset();
    } else {
      if (!confirm('Are you sure you want to generate the invoice?')) {
        return; // Cancel generation if user clicks cancel
      }
      pdfMake.createPdf(docDefinition).open();
      this.firestore
        .collection('invoices')
        .add({
          manager_id: this.manager_id,
          master_id: this.master_id,
          data: {
            customerName: this.invoice.customerName,
            address: this.invoice.address,
            email: this.invoice.email,
            contactNo: this.invoice.contactNo,
            additionalDetails: this.invoice.additionalDetails,
            products: this.invoice.products.map((product) =>
              product.toPlainObject()
            ),
            timestamp: new Date(),
            billNumber: billNumber,
          },
        })
        .then((docRef) => {
          console.log('Document written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
      this.invoice = new Invoice();
      this.invoiceForm.reset();
    }
  }

  addProduct() {
    this.invoice.products.push(new Product());
  }
}
