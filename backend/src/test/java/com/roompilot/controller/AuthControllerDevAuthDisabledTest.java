package com.roompilot.controller;

import static com.github.tomakehurst.wiremock.client.WireMock.configureFor;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static com.roompilot.fixtures.TestConstants.Endpoints.*;
import static com.roompilot.util.TestHelpers.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.roompilot.repository.UserRepository;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for AuthController with dev auth DISABLED. Separate class to avoid property
 * source conflicts with nested test classes. At the top level, @TestPropertySource properly
 * overrides @ActiveProfiles properties.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = {"app.enable-dev-auth=false"})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("AuthController - Dev Auth Disabled (Production Mode)")
class AuthControllerDevAuthDisabledTest {

  private static final WireMockServer wireMockServer;

  static {
    wireMockServer = new WireMockServer(wireMockConfig().dynamicPort());
    wireMockServer.start();
    configureFor("localhost", wireMockServer.port());
  }

  @DynamicPropertySource
  static void configureProperties(DynamicPropertyRegistry registry) {
    registry.add("wiremock.server.port", () -> wireMockServer.port());
  }

  @AfterAll
  static void stopWireMock() {
    if (wireMockServer != null && wireMockServer.isRunning()) {
      wireMockServer.stop();
    }
  }

  @Autowired private MockMvc mockMvc;

  @Autowired private UserRepository userRepository;

  @BeforeEach
  void setUp() {
    userRepository.deleteAll();
  }

  @Test
  @DisplayName("Dev login endpoint rejects all requests with 401 when dev auth disabled")
  void devLoginRejectedWhenDisabled() throws Exception {
    String email = uniqueEmail("prod-test");

    mockMvc
        .perform(
            post(DEV_LOGIN)
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.format("{\"email\": \"%s\"}", email))
                .with(csrf()))
        .andExpect(status().isUnauthorized());

    assertThat(userRepository.count()).isZero();
  }
}
