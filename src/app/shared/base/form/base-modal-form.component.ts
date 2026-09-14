import { Directive, inject, signal, effect, input, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FormMode } from '@shared/types';
import { getFieldError } from '@shared/utills/form-errors';

@Directive()
export abstract class BaseModalFormComponent<TRecord, TFormValue extends Record<string, any>, TPayload = TFormValue> {
    cancel = output<void>();
    save = output<TPayload>();
    mode = input<FormMode>('create');
    record = input<TRecord | null>(null);

    protected readonly fb = inject(FormBuilder);
    readonly submitting = signal(false);
    readonly serverError = signal<string | null>(null);

    /** Subclass defines its own typed FormGroup */
    abstract readonly form: FormGroup;

    /** Subclass provides mapping in/out of the form */
    protected abstract emptyValues(): TFormValue;
    protected abstract recordToValues(record: TRecord): TFormValue;

    protected toPayload(raw: TFormValue): TPayload {
        return raw as unknown as TPayload;
    }

    getError(control: AbstractControl) {
        return getFieldError(control);
    }

    constructor() {
        let lastKey: string | undefined = undefined;
        effect(() => {
            const record = this.record();
            const mode = this.mode();
            const currentId = this.getRecordId(record);
            const currentKey = `${currentId}:${mode}`;

            if (currentKey !== lastKey) {
                lastKey = currentKey;
                this.submitting.set(false);
                this.serverError.set(null);
                this.resetForm(false);
            }
            mode === 'view' ? this.form.disable() : this.form.enable();
        });
    }

    protected getRecordId(record: TRecord | null): unknown {
        return (record as any)?.id ?? null;
    }

    get f() {
        return this.form.controls;
    }

    resetForm(onCancel: boolean): void {
        const record = this.record();
        if (record && !onCancel) {
            this.form.reset(this.recordToValues(record));
        } else {
            this.form.reset(this.emptyValues());
        }
    }

    onSubmit(): void {
        if (this.mode() === 'view') return;
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.serverError.set(null);
        this.submitting.set(true);

        const raw = this.form.getRawValue() as TFormValue;
        const payload = this.toPayload(raw);
            
        this.save.emit(payload);
        this.form.reset(this.emptyValues());
    }

    onCancel(): void {
        this.serverError.set(null);
        this.submitting.set(false);
        // this.resetForm(true);
        this.cancel.emit();
    }
}