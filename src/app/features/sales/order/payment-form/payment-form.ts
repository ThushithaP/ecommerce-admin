import { Component, EventEmitter, Output, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { OrderPayment } from '../dto';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { InputText } from "primeng/inputtext";
import { OrderService } from '../services/order.service';
import { Button } from "primeng/button";

@Component({
  selector: 'app-payment-form',
  imports: [ReactiveFormsModule, NgClass, DatePipe, TitleCasePipe, InputText, Button],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css',
})
export class PaymentForm {
  selectedPayments = input<OrderPayment[] | null>(null);
  @Output() closePayment = new EventEmitter<void>();

  readonly transactionReferences = new Map<string, FormControl<string>>();
  private readonly submittingPayments = signal<Set<string>>(new Set());

  protected readonly service = inject(OrderService);

  @Output() paymentConfirm = new EventEmitter<{
    paymentId: string;
    transactionReference: string | null;
  }>();

  getSubmitStatus(paymentId: string): boolean {
    return this.submittingPayments().has(paymentId);
  }

  private setSubmitting(paymentId: string, submitting: boolean): void {
    const current = new Set(this.submittingPayments());

    if (submitting) {
      current.add(paymentId);
    } else {
      current.delete(paymentId);
    }

    this.submittingPayments.set(current);
  }

  getTransactionControl(paymentId: string): FormControl<string> {
    if (!this.transactionReferences.has(paymentId)) {
      this.transactionReferences.set(
        paymentId,
        new FormControl('', {
          nonNullable: true,
        })
      );
    }

    return this.transactionReferences.get(paymentId)!;
  }

  onConfirmPayment(payment: OrderPayment): void {
    const transactionReference = this.getTransactionControl(payment.id).value.trim();
    this.setSubmitting(payment.id, true);
    this.service.confirmPaymentOfOrder(payment.id,transactionReference || null).subscribe({
      next:(res) => {
        this.setSubmitting(payment.id,false);
        this.closePayment.emit();
      },
      error: (error) => {
        this.setSubmitting(payment.id, false);
        console.error('Payment confirmation failed:', error);
      },
    })
  }

  onClose():void {
    this.closePayment.emit();
  }
}
