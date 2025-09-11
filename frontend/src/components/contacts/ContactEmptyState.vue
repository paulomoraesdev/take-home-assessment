<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <!-- Illustration -->
    <div class="mb-8">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        class="text-gray-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Address book illustration -->
        <rect
          x="40"
          y="30"
          width="120"
          height="140"
          rx="8"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        />
        <!-- Book spine -->
        <rect
          x="40"
          y="30"
          width="12"
          height="140"
          fill="currentColor"
          opacity="0.3"
        />
        <!-- Tabs on spine -->
        <rect x="52" y="45" width="8" height="15" fill="currentColor" opacity="0.5" />
        <rect x="52" y="75" width="8" height="15" fill="currentColor" opacity="0.5" />
        <rect x="52" y="105" width="8" height="15" fill="currentColor" opacity="0.5" />
        <rect x="52" y="135" width="8" height="15" fill="currentColor" opacity="0.5" />
        
        <!-- Empty page content -->
        <line x1="65" y1="55" x2="140" y2="55" stroke="currentColor" opacity="0.2" stroke-width="1" />
        <line x1="65" y1="70" x2="125" y2="70" stroke="currentColor" opacity="0.2" stroke-width="1" />
        <line x1="65" y1="85" x2="135" y2="85" stroke="currentColor" opacity="0.2" stroke-width="1" />
        
        <!-- Question mark in center -->
        <circle cx="100" cy="120" r="20" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3" />
        <text x="100" y="130" text-anchor="middle" class="text-2xl" fill="currentColor" opacity="0.3">?</text>
      </svg>
    </div>
    
    <!-- Content -->
    <div class="max-w-md">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        You don't have any contacts yet
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Start by creating your first contact to organize your personal and professional connections.
      </p>
      
      <!-- Add Contact Button -->
      <RouterLink to="/contact">
        <Button class="inline-flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          Add your first contact
        </Button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from '@/components/ui/Button.vue'
</script>