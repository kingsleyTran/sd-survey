import { Component, OnInit } from '@angular/core';
import {AuthService} from "@shared/services/auth.service";
import {NavigationExtras, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

    showMenu = false;
    showUserMenu = false;
    showLangMenu = false;
    currentUser: any | null;

    // For i18n
    availableLangs: string[];
    selectedLang: string = 'en';

    constructor(
        protected router: Router,
        private auth: AuthService,
        public translateService: TranslateService
    ) {
    }

    ngOnInit(): void {
        try {
            this.currentUser = this.auth.currentUser();
            console.log(this.currentUser);
        } catch (e) {
            this.goTo(['admin/log-in']);
        }
        this.selectedLang = this.translateService.getDefaultLang();
        this.availableLangs = this.translateService.getLangs();
    }

    goTo(commands: any[], extra?: NavigationExtras) {
        if (this.router) {
            this.router.navigate(commands, extra);
        }
    }

    toggleMenu(): void {
        this.showMenu = !this.showMenu;
    }

    toggleUserMenu(): void {
        this.showUserMenu = !this.showUserMenu;
    }

    toggleLanguageMenu(): void {
        this.showLangMenu = !this.showLangMenu;
    }

    selectedLangChanged(lang: string) {
        this.translateService.use(lang);
        this.selectedLang = lang;
        this.showLangMenu = false;
    }

    async logOut() {
        await this.auth.logout();
    }

}
