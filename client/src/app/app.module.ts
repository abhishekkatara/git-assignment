import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  // declarations: [AppComponent],
  // bootstrap: [AppComponent],
  imports: [ BrowserModule, RouterOutlet, AppRoutingModule, HttpClientModule, BrowserAnimationsModule ],

})
export class AppModule {}
