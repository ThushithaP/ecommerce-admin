import { Component, inject } from '@angular/core';
import { BaseRoutedCrudPage } from '@shared/base/pages/base-routed-crud-page.component';
import { PromotionPayload, Promotions } from './dto';
import { PromotionService } from './services/promotion.service';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";

@Component({
  selector: 'app-promotion',
  imports: [Button, IconField, InputIcon, InputText],
  templateUrl: './promotion.html',
  styleUrl: './promotion.css',
})
export class Promotion extends BaseRoutedCrudPage<Promotions, PromotionPayload>{
  protected readonly basePath = 'admin/sales/promotion/manage';
  protected readonly service = inject(PromotionService);
  protected readonly entityLabel = 'Supplier';
}
