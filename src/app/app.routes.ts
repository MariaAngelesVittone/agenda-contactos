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
        title: "Login | Contact directory",
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: "register",
        title: "Register | Contact directory",
        component: Register,
        canActivate: [guestGuard]
    },
    {
        path: "contacts",
        title: "My contacts | Contact directory",
        component: ContactList,
        canActivate: [authGuard]
    },
    {
        path: "contacts/create",
        title: "New contact | Contact directory",
        component: CreateEditContact,
        canActivate: [authGuard]
    },
    {
        path: "contacts/:id",
        title: "Contact details | Contact directory",
        component: ContactDetails,
        canActivate: [authGuard]
    },
    {
        path: "contacts/:id/edit",
        title: "Edit contact | Contact directory",
        component: CreateEditContact,
        canActivate: [authGuard]
    },
    {
        path: "",
        redirectTo: "contacts",
        pathMatch: "full"
    },
    {
        path: "**",
        redirectTo: "contacts"
    }
];
