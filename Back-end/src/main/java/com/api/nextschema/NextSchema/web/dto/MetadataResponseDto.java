package com.api.nextschema.NextSchema.web.dto;


import com.api.nextschema.NextSchema.entity.Empresa;
import com.api.nextschema.NextSchema.enums.Validado;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MetadataResponseDto {
    private Integer id;
    private String nome;
    private Empresa empresa;
    private Validado validado;
}
