package com.api.nextschema.NextSchema.web.controller;

import com.api.nextschema.NextSchema.entity.Coluna;
import com.api.nextschema.NextSchema.entity.Metadata;
import com.api.nextschema.NextSchema.service.ColunaService;

import com.api.nextschema.NextSchema.web.dto.ColunaCreateDto;
import com.api.nextschema.NextSchema.web.dto.ColunaResponseDto;
import com.api.nextschema.NextSchema.web.dto.mapper.ColunaMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Controller
@RequestMapping("/colunas")
@RequiredArgsConstructor
@CrossOrigin("*")
@Tag(name = "Colunas", description = "Contém todas as operações relativas aos recursos para cadastro, edição e leitura de uma coluna.")
public class ColunaController {
    private final ColunaService colunaService;

    @Operation(
            summary = "Criar uma nova coluna.",
            description = "Recurso para criar uma nova coluna",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Recurso criado com sucesso",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ColunaResponseDto.class)))
            }
    )
    @PostMapping
    public ResponseEntity<ColunaResponseDto> create(@RequestBody ColunaCreateDto createDto){
        Coluna newColuna = colunaService.criarColuna(ColunaMapper.toColuna(createDto));
        return ResponseEntity.status(HttpStatus.CREATED).body(ColunaMapper.toDto(newColuna));
    }

    @GetMapping
    public ResponseEntity<List<ColunaResponseDto>> getAll(){
        List<Coluna> colunas = colunaService.buscarColunas();
        return ResponseEntity.ok(ColunaMapper.toListDto(colunas));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        colunaService.deleteporId(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColunaResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok().body(ColunaMapper.toDto(colunaService.buscarPorId(id)));
    }

    @PostMapping("/metadata")
    public ResponseEntity<List<ColunaResponseDto>> getByMetadata(@RequestBody Metadata metadata) {
        return ResponseEntity.ok().body(ColunaMapper.toListDto(colunaService.buscarPorMetadata(metadata)));
    }

}
