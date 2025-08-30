<template>
  <header class="bg-white border-bottom sticky-top">
    <nav class="navbar navbar-expand-md bg-white">
      <div class="container">
        <router-link class="navbar-brand fw-semibold" to="/">Men’s Health NFP</router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
                aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav ms-auto align-items-md-center">
            <li class="nav-item">
              <router-link to="/programs" class="nav-link" :class="{ active: $route.path.startsWith('/programs') }">Programs</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/learn" class="nav-link" :class="{ active: $route.path.startsWith('/learn') }">Learn</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/get-involved" class="nav-link" :class="{ active: $route.path.startsWith('/get-involved') }">Get Involved</router-link>
            </li>
            <li class="nav-item ms-md-2 mt-2 mt-md-0">
              <a href="#donate" class="btn btn-gradient btn-sm px-3">Donate</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
<script setup></script>
