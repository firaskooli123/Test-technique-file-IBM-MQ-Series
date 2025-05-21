import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MessageListComponent } from './features/messages/message-list/message-list.component';
import { MessageDetailComponent } from './features/messages/message-detail/message-detail.component';
import { PartnerListComponent } from './features/partners/partner-list/partner-list.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/messages', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'messages', 
    component: MessageListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'messages/:id', 
    component: MessageDetailComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'partners', 
    component: PartnerListComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/messages' }
]; 