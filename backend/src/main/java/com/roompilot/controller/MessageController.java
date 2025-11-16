package com.roompilot.controller;

import com.roompilot.model.Message;
import com.roompilot.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://localhost:5174", "https://roompilot.vercel.app"})
@Tag(name = "Messages", description = "Message management API")
@PreAuthorize("isAuthenticated()")
public class MessageController {

  @Autowired private MessageService messageService;

  @Operation(summary = "Get all messages", description = "Retrieves a list of all messages")
  @ApiResponse(responseCode = "200", description = "Successfully retrieved list")
  @GetMapping
  public List<Message> getAllMessages() {
    return messageService.getAllMessages();
  }

  @Operation(summary = "Get message by ID", description = "Retrieves a specific message by its ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Message found"),
        @ApiResponse(responseCode = "404", description = "Message not found")
      })
  @GetMapping("/{id}")
  public ResponseEntity<Message> getMessageById(
      @Parameter(description = "ID of the message to retrieve") @PathVariable Long id) {
    return messageService
        .getMessageById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @Operation(
      summary = "Create a new message",
      description = "Creates a new message with the provided content")
  @ApiResponse(responseCode = "200", description = "Message created successfully")
  @PostMapping
  public Message createMessage(
      @Parameter(description = "Message content in JSON format with 'content' field") @RequestBody
          Map<String, String> request) {
    String content = request.get("content");
    return messageService.createMessage(content);
  }

  @Operation(
      summary = "Update a message",
      description = "Updates an existing message with new content")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Message updated successfully"),
        @ApiResponse(responseCode = "404", description = "Message not found")
      })
  @PutMapping("/{id}")
  public ResponseEntity<Message> updateMessage(
      @Parameter(description = "ID of the message to update") @PathVariable Long id,
      @Parameter(description = "Updated message content in JSON format with 'content' field")
          @RequestBody
          Map<String, String> request) {
    try {
      String content = request.get("content");
      Message updatedMessage = messageService.updateMessage(id, content);
      return ResponseEntity.ok(updatedMessage);
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @Operation(summary = "Delete a message", description = "Deletes a message by its ID")
  @ApiResponse(responseCode = "204", description = "Message deleted successfully")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteMessage(
      @Parameter(description = "ID of the message to delete") @PathVariable Long id) {
    messageService.deleteMessage(id);
    return ResponseEntity.noContent().build();
  }
}
