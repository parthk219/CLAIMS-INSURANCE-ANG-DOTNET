import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // ✅ FIXED: styleUrls not styleUrl
})
export class LoginComponent {
  form!: FormGroup; // ✅ Declare first, initialize inside constructor

  loading = false;
  serverError: string | null = null;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router
  ) {
    // ✅ Initialize here — now fb is ready
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.serverError = null;

    const { email, password } = this.form.value;

    this.auth.login(email!, password!).pipe(
      catchError(err => {
        this.serverError = 'Invalid credentials';
        this.loading = false;
        return of(null);
      })
    ).subscribe(res => {
      this.loading = false;
      if (res) {
        this.router.navigate(['/claims']); // ✅ redirect to claims dashboard
      }
    });
  }
}
