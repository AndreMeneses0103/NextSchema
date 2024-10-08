package com.api.nextschema.NextSchema.service;


import com.api.nextschema.NextSchema.entity.Empresa;
import com.api.nextschema.NextSchema.entity.Usuario;
import com.api.nextschema.NextSchema.entity.UsuarioEmpresa;
import com.api.nextschema.NextSchema.exception.EntityNotFoundException;
import com.api.nextschema.NextSchema.repository.EmpresaRepository;
import com.api.nextschema.NextSchema.repository.MetadataRepository;
import com.api.nextschema.NextSchema.repository.UsuarioEmpresaRepository;
import com.api.nextschema.NextSchema.web.dto.EmpresaAtualizarDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpresaService {
    private final EmpresaRepository empresaRepository;
    private final UsuarioEmpresaRepository usuarioEmpresaRepository;
    private final MetadataService metadataService;


    public Empresa criar(Empresa empresa){ return empresaRepository.save(empresa);}

    public Empresa buscarId(Long id) {return empresaRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Empresa não encontrada"));}

    public List <Empresa> buscarTodos() {return empresaRepository.findAll();}

    public List <Long> buscarTodosId() {return empresaRepository.findAllId();}

    public Empresa buscarCNPJ(String cnpj) {return empresaRepository.findbyCNPJ(cnpj);}
    @Transactional
    public void deleteId(Long id){
        Empresa empresa = new Empresa();
        empresa.setId(id);
        usuarioEmpresaRepository.deleteByEmpresa(empresa);
        metadataService.deleteByEmpresa(empresa);
        empresaRepository.deleteById(id);}

    public Empresa atualizarEmpresa(EmpresaAtualizarDto empresa) {
        Empresa empresaBuscada = buscarId(empresa.getId());
        empresaBuscada.setNome(empresa.getNome());
        return empresaRepository.save(empresaBuscada);
    }

    @Transactional
    public void criarRelacao(Usuario usuario, List<Long> listIdEmpresa){
        for(Long idEmpresa:listIdEmpresa){
            Empresa empresa = buscarId(idEmpresa);
            UsuarioEmpresa novaRelacao = new UsuarioEmpresa();

            novaRelacao.setUsuario(usuario);
            novaRelacao.setEmpresa(empresa);
            usuarioEmpresaRepository.save(novaRelacao);
        }
    }
}
