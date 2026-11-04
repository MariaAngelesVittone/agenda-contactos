import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ContactList } from './pages/contact-list/contact-list';
import { ContactDetails } from './pages/contact-details/contact-details';
import { CreateEditContact } from './pages/create-edit-contact/create-edit-contact';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
    {
        path: "login",
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: "register",
        component: Register,
        canActivate: [guestGuard]
    },
    {
        path: "contacts",
        component: ContactList,
        canActivate: [authGuard]
    },
    {
        path: "contacts/create",
        component: CreateEditContact,
        canActivate: [authGuard]
    },
    {
        path: "contacts/:id",
        component: ContactDetails,
        canActivate: [authGuard]
    },
    {
        path: "contacts/:id/edit",
        component: CreateEditContact,
        canActivate: [authGuard]
    },
    {
        path: "",
        redirectTo: "contacts",
        pathMatch: "full"
    }
];