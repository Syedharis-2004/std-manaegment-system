import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideHouse,
  LucideBadgeInfo,
  LucideGraduationCap,
  LucideCalendarDays,
  LucideBellRing,
  LucideLogIn,
  LucideUserPlus,
  LucideMapPin,
  LucidePhoneCall,
  LucideMail,
  LucideArrowRight,
  LucideBookOpen,
  LucideUsers,
  LucideClock,
  LucideDollarSign
} from '@lucide/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideHouse,
    LucideBadgeInfo,
    LucideGraduationCap,
    LucideCalendarDays,
    LucideBellRing,
    LucideLogIn,
    LucideUserPlus,
    LucideMapPin,
    LucidePhoneCall,
    LucideMail,
    LucideArrowRight,
    LucideBookOpen,
    LucideUsers,
    LucideClock,
    LucideDollarSign
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  currentYear = new Date().getFullYear();
  
  courses = [
    {
      title: 'Computer Science & IT',
      duration: '4 Years',
      description: 'Explore software development, data structures, algorithms, and artificial intelligence.',
      fee: '$2,400 / Sem',
      tag: 'Technology'
    },
    {
      title: 'Business Administration',
      duration: '4 Years',
      description: 'Learn modern marketing, corporate finance, entrepreneurship, and management strategies.',
      fee: '$2,100 / Sem',
      tag: 'Business'
    },
    {
      title: 'Digital Arts & Design',
      duration: '3 Years',
      description: 'Master UI/UX design, graphic design, 3D modeling, and digital media production.',
      fee: '$1,900 / Sem',
      tag: 'Design'
    }
  ];

  events = [
    {
      day: '12',
      month: 'Jul',
      title: 'Annual Research Conference 2026',
      time: '09:00 AM - 04:00 PM',
      location: 'Main Auditorium'
    },
    {
      day: '18',
      month: 'Jul',
      title: 'Tech Fest & Hackathon',
      time: '10:00 AM - 08:00 PM',
      location: 'IT Lab 3'
    },
    {
      day: '25',
      month: 'Jul',
      title: 'Career Placement Seminar',
      time: '02:00 PM - 05:00 PM',
      location: 'Seminar Hall B'
    }
  ];

  notices = [
    {
      date: 'July 05, 2026',
      title: 'Admission Open for Fall Semester 2026'
    },
    {
      date: 'July 02, 2026',
      title: 'Midterm Examination Schedule Released'
    },
    {
      date: 'June 28, 2026',
      title: 'Scholarship Application Deadline Extended'
    }
  ];
}
