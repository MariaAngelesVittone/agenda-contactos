import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ContactList } from './pages/contact-list/contact-list';
import { ContactDetails } from './pages/contact-details/contact-details';
import { CreateEditContact } from './pages/create-edit-contact/create-edit-contact';

export const routes: Routes = [
    {
        path: "login",
        component: Login
    },
    {
        path: "register",
        component: Register
    },
    {
        path: "contacts",
        component: ContactList
    },
    {
        path: "contacts/create",
        component: CreateEditContact
    },
    {
        path: "contacts/:id",
        component: ContactDetails
    },
    {
        path: "contacts/:id/edit",
        component: CreateEditContact
    },
    {
        path: "",
        redirectTo: "contacts",
        pathMatch: "full"
    }
];