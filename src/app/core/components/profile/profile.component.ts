import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ResourceService } from '../../services/resource.service';
import { DSResource, DSAttribute } from '../../models/resource.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('anchor') public anchor: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;

  showMenu = false;
  loginUser: DSResource;
  brandLetter = '';
  attrPhoto: DSAttribute;
  attrJobTitle: DSAttribute;
  currentLanguage = '';

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  constructor(
    private svcResource: ResourceService,
    private translate: TranslateService,
    private auth: AuthService
  ) {}

  @HostListener('document:keydown.escape', ['$event'])
  public keydown(event: any): void {
    if (event.keyCode === 27) {
      this.showMenu = false;
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.showMenu = false;
    }
  }

  ngOnInit() {
    this.currentLanguage = this.translate.currentLang;
    this.loginUser = this.svcResource.getLoginUser();
    if (this.loginUser) {
      this.brandLetter = this.loginUser.DisplayName ? this.loginUser.DisplayName.substr(0, 1) : '-';
      this.attrPhoto = this.loginUser.Attributes['Photo'];
      this.attrJobTitle = this.loginUser.Attributes['JobTitle'];
    }
  }

  onToggle() {
    this.showMenu = !this.showMenu;
  }

  onChangeLanguage(language: string) {
    this.currentLanguage = language;
    this.translate.use(language);
  }

  onLogout() {
    this.auth.logout();
  }
}
