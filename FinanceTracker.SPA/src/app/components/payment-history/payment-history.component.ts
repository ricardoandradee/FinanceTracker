import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Payment } from '../../models/payment.model';
import { YesNoDialogComponent } from '../../shared/yes.no.dialog.component';
import { PaymentAddComponent } from '../payment-add/payment-add.component';
import { Category } from '../../models/category.model';
import { CurrencyConverterMapper } from '../../models/currency.converter.mapper.model';
import { PaymentService } from 'src/app/services/payment.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { UiService } from 'src/app/services/ui.service';
import { CurrencyList } from 'src/app/models/currency.model';
import { CategoryService } from 'src/app/services/category.service';

import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/reducers/app.reducer';
import * as UI from 'src/app/actions/ui.actions';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})

export class PaymentHistoryComponent implements OnInit, AfterViewInit {
  displayedColumns = ['CreatedDate', 'Category', 'Description', 'Establishment', 'Price', 'Actions'];
  dataSource = new MatTableDataSource<Payment>();
  isLoading$: Observable<boolean>;
  editPayment: Payment;
  oldPayment: Payment;
  rowInEditMode = false;
  private currencies = [];
  private categoriesFromTable: Category[] = [];
  private allCategories: Category[] = [];

  private categoryCount = 0;
  private paymentDates = [];
  private paymentDate = "All";
  private category = "All";
  private totalPrice = 0;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(private uiService: UiService, private paymentService: PaymentService,
              private currencyService: CurrencyService, private dialog: MatDialog,
              private categoryService: CategoryService,
              private store: Store<{ui: fromRoot.State}>) {
                this.currencies = CurrencyList;
              }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.categoryService.getCategories.subscribe((categoryList: Category[]) => {
      this.allCategories = categoryList;
      this.categoryCount = categoryList.length;
    });
    
    this.paymentService.getPaymentsForUser().subscribe((payments: Payment[]) => {
      this.paymentService.setPayments = payments;
    });
    
    this.paymentService.getPayments.subscribe((payments: Payment[]) => {
      this.populateDropDownLists(payments);
      this.bindDataSource(payments);
      this.updateCategoriesDeletionCondition();
    });
  }

  updateCategoriesDeletionCondition() {
    var payments: Payment[] = this.dataSource.data as Payment[];
    this.allCategories.forEach(c => {
      c.canBeDeleted = !payments.some(b => b.categoryId === c.id);
    });
    this.categoryService.setCategories = this.allCategories;
  }

  bindDataSource(payments: Payment[]) {
    this.dataSource.data = payments;
  }

  populateDropDownLists(payments: Payment[]) {
    this.categoriesFromTable = [];
    this.paymentDates = [];

    for (let payment of payments) {
      if (!this.categoriesFromTable.some(x => x.id === payment.categoryId)) {
        this.categoriesFromTable.push({ id: payment.categoryId, name: payment.categoryName } as Category);
      }

      if (!this.paymentDates.some(x => x.key === payment.createdDateString)) {
        this.paymentDates.push({ key: payment.createdDateString, value: payment.createdDateString });
      }
    }
  }

  onOpenAddPaymentDialog() {
    const dialogRef = this.dialog.open(PaymentAddComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.store.dispatch(new UI.StartLoading());
        const paymentToBeCreated = result.data as Payment;
        this.paymentService.createPayment(paymentToBeCreated).subscribe(response => {
          if(response.ok) {
            const paymentCreated = response.body as Payment;
            
            var paymentsFromDataSource = this.dataSource.data;
            paymentsFromDataSource.push(paymentCreated);
            this.paymentService.setPayments = paymentsFromDataSource;

            this.uiService.showSnackBar('Payment was sucessfully created.', 3000);
          } else {
            this.uiService.showSnackBar('There was an error while creating payment, please, try again later.', 3000);
          }
      }, (err) => {
          this.uiService.showSnackBar(err.error, 3000);
      }, () => { this.store.dispatch(new UI.StopLoading()); });
      }
    });
  }

  get userCurrency(): string {
    const user: User = JSON.parse(localStorage.getItem('user'));
    return user.userCurrency;
  }

  getTotalCost() {
    
    const currencyMapperList = this.dataSource.filteredData.map((Payment: Payment) => {
      return { currencyFrom: Payment.currency, currencyTo: this.userCurrency, price: Payment.price } as CurrencyConverterMapper;
    });

    return this.currencyService.convertCurrencyList(currencyMapperList);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (pr, filter) => {

      return this.dateFilterMatches(pr) && this.categoryFilterMatches(pr);
    };
  }

  doFilterByDate() {
    this.dataSource.filter = this.getDateFilter();
  }

  doFilterByCategory() {
    this.dataSource.filter = '[FilterByCategory]' + this.category;
  }

  dateFilterMatches(Payment: Payment): boolean {
    var filter = this.getDateFilter();
    const value = '[FilterByDate]' + Payment.createdDateString;
    return filter.indexOf('[FilterByDate]') === -1 || (filter === "[FilterByDate]All" || value.indexOf(filter) >= 0);
  }

  categoryFilterMatches(Payment: Payment): boolean {
    var filter = '[FilterByCategory]' + this.category;
    const value = '[FilterByCategory]' + Payment.categoryId;
    return filter.indexOf('[FilterByCategory]') === -1 || (filter === "[FilterByCategory]All" || value.indexOf(filter) >= 0);
  }

  getDateFilter(): string {
    let dateToBeSearched = this.paymentDate === "All" ? "All" : this.paymentDate;
    return '[FilterByDate]' + dateToBeSearched;
  }

  onDelete(Payment: Payment) {
    const dialogRef = this.dialog.open(YesNoDialogComponent, { data: { message: "Are you sure you want to delete this item from your history?", title: "Are you sure?" } });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(new UI.StartLoading());
        this.paymentService.deletePayment(Payment.id).subscribe(response => {
          var paymentsFromDataSource = this.dataSource.data;
          let paymentIndex = paymentsFromDataSource.findIndex(x => x.id === Payment.id);
          if (paymentIndex > -1) {
            paymentsFromDataSource.splice(paymentIndex, 1);
          }
          this.paymentService.setPayments = paymentsFromDataSource;
      }, (err) => {
          this.uiService.showSnackBar(err.error, 3000);
      }, () => { this.store.dispatch(new UI.StopLoading()); });
      }
    });
  }

  onEdit(Payment: Payment) {
    this.editPayment = Payment && Payment.id ? Payment : {} as Payment;
    this.oldPayment = {...this.editPayment};
    this.rowInEditMode = true;
  }

  onSaveChanges() {
    this.store.dispatch(new UI.StartLoading());
    this.paymentService.updatePayment(this.editPayment).subscribe(response => {
      if (response.ok) {
        var paymentsFromDataSource = this.dataSource.data;

        let paymentIndex = paymentsFromDataSource.findIndex(x => x.id === this.editPayment.id);

        if (paymentIndex > -1) {
          paymentsFromDataSource.splice(paymentIndex, 1);
          let category = this.allCategories.find(x => x.id === this.editPayment.categoryId);
          this.editPayment.categoryName = category.name;
          paymentsFromDataSource.splice(paymentIndex, 0, this.editPayment);
        }

        this.paymentService.setPayments = paymentsFromDataSource;
        this.editPayment = {} as Payment;
        this.onCancelEdit();
        this.uiService.showSnackBar('Payment successfully updated.', 3000);
        }else{
          this.uiService.showSnackBar('There was an error while trying to update your Payment. Please, try again later!', 3000);
        }
    }, (err) => {
        this.uiService.showSnackBar(err.error, 3000);
        this.onCancelEdit();
    }, () => { this.store.dispatch(new UI.StopLoading()); });
  }

  onCancelEdit(){
    this.rowInEditMode = false;
    this.editPayment = {} as Payment;
    this.oldPayment = {} as Payment;
  }
}
