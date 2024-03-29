package com.api.nextschema.NextSchema.service;

import com.api.nextschema.NextSchema.dto.UsuarioDTO;
import com.api.nextschema.NextSchema.entity.Usuario;
import com.api.nextschema.NextSchema.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;
    @Transactional(readOnly = true)
    public UsuarioDTO findById(Long id){
        Usuario result = usuarioRepository.findById(id).get(); //tratar exception no caso de nao existir
        UsuarioDTO dto = new UsuarioDTO(result);

        return dto;
    }
    @Transactional(readOnly = true)
    public List<UsuarioDTO> findAll()
    {
        List <Usuario> result = usuarioRepository.findAll();
        List <UsuarioDTO> dto = result.stream().map(UsuarioDTO::new).toList();

        return dto;
    }
}
