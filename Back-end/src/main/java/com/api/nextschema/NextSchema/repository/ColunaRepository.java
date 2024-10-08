package com.api.nextschema.NextSchema.repository;

import com.api.nextschema.NextSchema.entity.Coluna;
import com.api.nextschema.NextSchema.entity.Metadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ColunaRepository extends JpaRepository<Coluna, Long>{
    List<Coluna> findColunasByMetadata(Metadata metadata);

    @Modifying
    @Query("UPDATE Coluna c SET c.chavePrimaria = :isPrimary WHERE c.id = :id")
    void updateChavePrimaria (Long id, Boolean isPrimary);

    @Modifying
    @Query("DELETE FROM Coluna c WHERE c.metadata = :metadata")
    void deleteByMetadata(@Param("metadata") Metadata metadata);
}
